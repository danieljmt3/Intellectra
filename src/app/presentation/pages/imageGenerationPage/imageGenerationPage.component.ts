import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(private openiaservice: OpenAiService, private cdRefor:ChangeDetectorRef) {}

  generarImagen() {
    if (!this.prompt.trim()) return;

    this.loading = true;

    /*if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = '';
    }*/

    this.openiaservice.imagengeneration(this.prompt).subscribe({
      next: (blob: Blob) => {
        this.imageUrl = URL.createObjectURL(blob);
        this.loading = false;
        console.log("Imagen recibida",this.imageUrl)
        this.cdRefor.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.imageUrl = '';
        this.loading = false;
        alert('error al generar la imagen');
      },
    });
  }
}
