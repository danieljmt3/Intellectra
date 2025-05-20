import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translatePage.component.html',
})
export default class TranslatePageComponent {
  idiomas = [
    'english', 'spanish', 'french', 'german', 'italian', 'portuguese',
    'russian', 'chinese_simplified', 'chinese_traditional', 'japanese',
    'korean', 'arabic', 'hindi', 'tamil', 'bengali', 'urdu', 'vietnamese',
    'thai', 'turkish', 'ukrainian', 'swahili', 'hausa', 'yoruba', 'amharic',
    'fulfulde', 'khmer', 'myanmar', 'malayalam', 'telugu', 'indonesian'
  ];

  userText: string = '';
  sourceLang: string = 'english';
  targetLang: string = 'spanish';
  translatedText: string = '';

  constructor(private http: HttpClient) {}

  translate() {
    const payload = {
      prompt: this.userText,
      lenbase: this.sourceLang,
      lentradu: this.targetLang,
    };

    this.http.post<any>('http://localhost:3000/api/traducir', payload).subscribe({
      next: (res) => {
        this.translatedText = res.message.translation_text;
      },
      error: () => {
        this.translatedText = 'Error al traducir.';
      }
    });
  }
}
