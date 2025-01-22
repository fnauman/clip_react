from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import torch
from PIL import Image
import io
import json
import open_clip

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app default port; 3000 for npx create-react-app frontend, 5173 for npm create vite@latest frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model globally
MODEL = 'hf-hub:Marqo/marqo-fashionSigLIP'
model, _, preprocess_val = open_clip.create_model_and_transforms(MODEL)
tokenizer = open_clip.get_tokenizer(MODEL)
device = "cuda" if torch.cuda.is_available() else "cpu"

class TextInput(BaseModel):
    text_list: List[str]

@app.post("/encode_image/")
async def encode_image(file: UploadFile = File(...)):
    # Read and preprocess image
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    processed_image = preprocess_val(image).unsqueeze(0)
    
    # Generate features
    with torch.inference_mode(), torch.autocast(device, dtype=torch.bfloat16):
        image_features = model.encode_image(processed_image)
    
    # Normalize
    image_features = image_features / image_features.norm(dim=-1, keepdim=True)
    return {"features": image_features.tolist()}

@app.post("/encode_text/")
async def encode_text(text_input: TextInput):
    text = tokenizer(text_input.text_list)
    
    with torch.inference_mode(), torch.autocast(device, dtype=torch.bfloat16):
        text_features = model.encode_text(text)
    
    # Normalize
    text_features = text_features / text_features.norm(dim=-1, keepdim=True)
    return {"features": text_features.tolist()}

@app.post("/compute_similarity/")
async def compute_similarity(
    file: UploadFile = File(...),
    text_input: str = Form(...)  # Change TextInput to str and use Form
):
    # Parse the text_input string back to dictionary
    text_input_dict = json.loads(text_input)
    text_input_obj = TextInput(**text_input_dict)
    
    # Get image features
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    processed_image = preprocess_val(image).unsqueeze(0)
    
    # Get text features
    text = tokenizer(text_input_obj.text_list)
    
    with torch.inference_mode(), torch.autocast(device, dtype=torch.bfloat16):
        image_features = model.encode_image(processed_image)
        text_features = model.encode_text(text)
    
    # Normalize
    image_features = image_features / image_features.norm(dim=-1, keepdim=True)
    text_features = text_features / text_features.norm(dim=-1, keepdim=True)
    
    # Compute probabilities
    text_probs = (100.0 * image_features @ text_features.T).softmax(dim=-1)
    
    return {
        "probabilities": text_probs[0].tolist(),
        "labels": text_input_obj.text_list
    }

