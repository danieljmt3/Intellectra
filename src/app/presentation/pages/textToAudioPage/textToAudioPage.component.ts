import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {
  userText = '';

  speakText() {
    if (!this.userText.trim()) {
      alert('Por favor, escribe algún texto.');
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(this.userText);
      utterance.lang = 'es-ES'; 
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Tu navegador no soporta texto a voz.');
    }
  }
}
