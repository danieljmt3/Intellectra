import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  imageUrl: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  generarImagen() {
    if (!this.prompt.trim()) return;

    this.loading = true;
    this.http
      .post('http://localhost:3000/api/imagen', { prompt: this.prompt }, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          this.imageUrl = URL.createObjectURL(blob);
          this.loading = false;
        },
        error: () => {
          this.imageUrl = '';
          this.loading = false;
          alert('Error al generar la imagen');
        },
      });
  }
}
