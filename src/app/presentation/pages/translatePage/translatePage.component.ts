import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { mbartLangCodes } from 'app/utils/lenguajes-codes';

type LangKey = keyof typeof mbartLangCodes;

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translatePage.component.html',
})
export default class TranslatePageComponent {
  idiomas = Object.keys(mbartLangCodes);

  userText: string = '';
  sourceLang: LangKey = 'english';
  targetLang: LangKey = 'spanish';
  translatedText: string = '';

  constructor(private openAiService: OpenAiService) {}

  translate() {
    const sourceCode = mbartLangCodes[this.sourceLang];
    const targetCode = mbartLangCodes[this.targetLang];

    if (!sourceCode || !targetCode) {
      this.translatedText = 'Idioma no soportado.';
      return;
    }

    this.openAiService
      .traducir(this.userText, sourceCode, targetCode)
      .subscribe({
        next: (res) => {
          this.translatedText = res.translatedText;
        },
        error: () => {
          this.translatedText = 'Error al traducir.';
        },
      });
  }
}
