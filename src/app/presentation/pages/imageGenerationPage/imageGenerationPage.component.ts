import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-generation-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imageGenerationPage.component.html',
})
export default class ImageGenerationPageComponent {
  prompt: string = '';
  imageUrl: string | null = null;

  constructor(private http: HttpClient) {}

  generarImagen() {
    if (!this.prompt.trim()) return;

    this.http
      .post('/api/imagen-generada', { prompt: this.prompt }, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.imageUrl = url;
        },
        error: () => {
          this.imageUrl = '';
          alert('Error al generar la imagen');
        },
      });
  }
}
