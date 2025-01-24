# App for CLIP-based text-image similarity

This app has been built with [Vite](https://vitejs.dev/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) and [marqo-fashionSigLIP](https://huggingface.co/Marqo/marqo-fashionSigLIP). 

- **Frontend**: [vite](https://vitejs.dev/)
- **Backend**: [fastapi](https://fastapi.tiangolo.com/)


## Getting started

1. Run the frontend by executing the following command in the frontend directory:
    ```bash
    npm run dev
    ```
2. Run the backend by executing the following command in the backend directory:
    ```bash
    uvicorn main:app --reload
    ```

Go to [http://localhost:5173/](http://localhost:5173/) to use the app.


## Installation

This guide assumes Ubuntu 24.04 OS and `nodejs` is not installed. If `nodejs` is installed, you can skip the installation of `nodejs` (steps 1 and 2 below).

**### Frontend ###**

1. Install [Node Version Manager](https://github.com/nvm-sh/nvm) (NVM):
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    ```
2. Install Node.js: 
    ```bash
    nvm install --lts
    ```
    Run `source ~/.bashrc` to make the changes take effect or start a new terminal.
3. Install dependencies:
    ```bash
    npm install
    ```
4. Install `shadcn/ui`:
    ```bash
    npm install -D @types/node
    npx shadcn@latest init
    ```
    Choose: `Style: Default`, `Base color: Slate`, `CSS Variables: Yes`.
5. Run the frontend by executing the following command in the frontend directory:
    ```bash
    npm run dev
    ```

**### Backend ###**

1. Install Python 3.10:
    ```bash
    conda create -n clip python=3.10
    ```
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Run the backend by executing the following command in the backend directory:
    ```bash
    uvicorn main:app --reload
    ```

4. (Optional) Test the backend by executing the following command in the backend directory:
    ```bash
    curl -X POST http://localhost:8000/compute_similarity/   -F "file=@/home/Downloads/test.jpg"   -F 'text_input={"text_list": ["green", "blue", "gray", "red", "pink", "yellow", "black", "multicolor", "white"]}'
    ```

This will first download the model weights from Huggingface. The model weights will be cached in ~/.cache/huggingface/hub. The model weights will be downloaded only once.
