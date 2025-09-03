import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {
  userText = '';

  selectedGender: string = 'mujer';

  audioUrl: SafeUrl | null = null;
  isLoading: boolean = false;

  constructor(
    private openAiservice: OpenAiService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  speakText() {
    if (!this.userText.trim()) {
      alert('Por favor, escribe algún texto.');
      return;
    }
    console.log(environment.apiurl)
    this.isLoading = true;
    this.audioUrl = null;

    this.openAiservice
      .texttospeech(this.userText, this.selectedGender)
      .subscribe({
        next: (audioBlob: Blob) => {
          console.log('Audio Blob recibido:', audioBlob);
          const url = URL.createObjectURL(audioBlob);
          this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(url);

          console.log('URL de audio creada y sanitizada:', this.audioUrl);

          this.isLoading = false;
          console.log('isLoading ahora es:', this.isLoading);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('ERROR en la suscripción del audio:', error);
          alert(
            'Hubo un error al generar el audio. Por favor, inténtalo de nuevo.'
          );
          this.isLoading = false;
        },complete:()=>{
          console.log("Petición de audio completada")
        },
      });
  }
}
