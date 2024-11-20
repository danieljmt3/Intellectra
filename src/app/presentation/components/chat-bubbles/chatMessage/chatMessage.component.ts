import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './chatMessage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
  @Input({ required: true }) text!: string;

  // Getter que convierte saltos de línea a etiquetas <br>
  get formattedText(): string {
    return this.text.replace(/\n/g, '<br>');
  }
}
