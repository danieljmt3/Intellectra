import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './translatePage.component.html'
})
export default class TranslatePageComponent {
  userText: string = '';
  translatedText: string = '';
  sourceLang: string = 'spa_Latn';
  targetLang: string = 'eng_Latn';

  languageOptions = [
    { name: 'Español', code: 'spa_Latn' },
    { name: 'Inglés', code: 'eng_Latn' },
    { name: 'Francés', code: 'fra_Latn' },
    { name: 'Alemán', code: 'deu_Latn' },
    { name: 'Italiano', code: 'ita_Latn' },
    { name: 'Portugués', code: 'por_Latn' },
    { name: 'Ruso', code: 'rus_Cyrl' },
    { name: 'Chino Simplificado', code: 'zho_Hans' },
    { name: 'Chino Tradicional', code: 'zho_Hant' },
    { name: 'Japonés', code: 'jpn_Jpan' },
    { name: 'Coreano', code: 'kor_Hang' },
    { name: 'Árabe', code: 'ara_Arab' },
    { name: 'Hindi', code: 'hin_Deva' },
    { name: 'Tamil', code: 'tam_Taml' },
    { name: 'Bengalí', code: 'ben_Beng' },
    { name: 'Urdu', code: 'urd_Arab' },
    { name: 'Vietnamita', code: 'vie_Latn' },
    { name: 'Tailandés', code: 'tha_Thai' },
    { name: 'Turco', code: 'tur_Latn' },
    { name: 'Ucraniano', code: 'ukr_Cyrl' },
    { name: 'Suajili', code: 'swa_Latn' },
    { name: 'Hausa', code: 'hau_Latn' },
    { name: 'Yoruba', code: 'yor_Latn' },
    { name: 'Amhárico', code: 'amh_Ethi' },
    { name: 'Fulfulde', code: 'ful_Latn' },
    { name: 'Khmer', code: 'khm_Khmr' },
    { name: 'Birmano', code: 'mya_Mymr' },
    { name: 'Malayalam', code: 'mal_Mlym' },
    { name: 'Telugu', code: 'tel_Telu' },
    { name: 'Indonesio', code: 'ind_Latn' }
  ];

  handleTranslate() {
    if (this.userText.trim()) {
      this.translatedText = `[${this.sourceLang}→${this.targetLang}] ${this.userText}`;
      // Aquí deberías conectar con un servicio real de traducción
    } else {
      this.translatedText = '';
    }
  }
}

