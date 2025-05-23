import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
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
  loading: boolean = false; // nuevo estado

  constructor(private openAiService: OpenAiService, private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  translate() {
    const sourceCode = mbartLangCodes[this.sourceLang];
    const targetCode = mbartLangCodes[this.targetLang];

    if (!sourceCode || !targetCode || !this.userText.trim()) {
      this.translatedText = 'Idioma no soportado o texto vacío.';
      return;
    }

    this.loading = true;

    this.openAiService
      .traducir(this.userText, sourceCode, targetCode)
      .subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            console.log('Respuesta completa:', res);
            this.translatedText =
              res?.translatedText ?? 'Sin traducción disponible.';
            this.loading = false;
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.translatedText = 'Error al traducir.';
            this.loading = false;
          });
        },
      });
  }
}
