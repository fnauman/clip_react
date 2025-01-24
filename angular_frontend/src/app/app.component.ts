import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

interface ColorResult {
  probabilities: number[];
  labels: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedImage: string | null = null;
  imageFile: File | null = null;
  isAnalyzing: boolean = false;
  colorResults: { color: string; probability: number }[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleImageFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.handleImageFile(files[0]);
    }
  }

  private handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('File size should not exceed 10MB');
      return;
    }

    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async analyzeImage() {
    if (!this.imageFile) return;

    this.isAnalyzing = true;
    const formData = new FormData();
    formData.append('file', this.imageFile);
    
    // Add the text input data
    const textInput = {
      // text_list: ["jeans", "t-shirt", "dress", "jacket", "shoes"]
      text_list: ["green", "blue", "gray", "red", "pink", "yellow", "black", "multicolor", "white"]
    };
    formData.append('text_input', JSON.stringify(textInput));

    try {
      console.log('Sending request with data:', {
        file: this.imageFile,
        textInput
      });
      
      const response = await this.http.post<ColorResult>('http://localhost:8000/compute_similarity/', formData).toPromise();
      console.log('Received response:', response);
      
      if (response) {
        if (!response.labels || !response.probabilities) {
          console.error('Invalid response format:', response);
          throw new Error('Invalid response format from server');
        }
        
        this.colorResults = response.labels.map((label, index) => ({
          color: label,
          probability: response.probabilities[index]
        }));
        console.log('Processed results:', this.colorResults);
      }
    } catch (error) {
      console.error('Full error details:', error);
      alert('Error analyzing image. Please try again.');
    } finally {
      this.isAnalyzing = false;
    }
  }
}
