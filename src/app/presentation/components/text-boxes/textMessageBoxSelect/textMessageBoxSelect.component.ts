import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Option {
  id: string;
  text: string;
}

export interface TextMessageBoxEvent {
  optionId: string;
  optionText: string;
}

@Component({
  selector: 'app-text-message-box-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textMessageBoxSelect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxSelectComponent {
  @Input() placeholder: string = '';
  @Input({ required: true }) options!: Option[];
  @Output() onMessage = new EventEmitter<TextMessageBoxEvent>();

  public fb = inject(FormBuilder);
  public form = this.fb.group({
    prompt: ['', Validators.required],
    selectedOption: ['', Validators.required],
  });

  trackOptionId(index: number, option: Option): string {
    return option.id;
  }

  handleSubmit() {
    if (this.form.invalid) return;

    const { prompt, selectedOption } = this.form.value;

    if (prompt && selectedOption) {
      this.onMessage.emit({
        optionId: selectedOption,
        optionText: prompt,
      });
    }

    this.form.reset();
  }
}
