import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from 'environments/environment';

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
    console.log(environment.apiurl)
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

  mostrarImagen(event: Event) {
  const img = event.target as HTMLImageElement;
  img.classList.remove('opacity-0', 'translate-y-4');
  img.classList.add('opacity-100', 'translate-y-0');
}

}