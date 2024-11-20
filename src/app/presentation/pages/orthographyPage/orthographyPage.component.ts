import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxSelectComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { TextMessageBoxEvent } from '@components/index';

@Component({
  selector: 'app-orthography-page',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {
  public messages = signal<Message[]>([{ text: 'Hola Mundo', isGpt: false }]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    console.log({ prompt });
    this.isLoading.set(true);

    this.openAiService.correctaescritura(prompt).subscribe({
      next: (response) => {
        this.messages.update((messages) => [
          ...messages,
          { text: response.correctedText, isGpt: true },
        ]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al corregir:', err);
        this.isLoading.set(false);
      },
    });
  }

  handleMessageWithSelect(event: TextMessageBoxEvent) {
    const selectedText = event.optionText;
    if (selectedText) {
      this.handleMessage(selectedText);
    }
  }
}
