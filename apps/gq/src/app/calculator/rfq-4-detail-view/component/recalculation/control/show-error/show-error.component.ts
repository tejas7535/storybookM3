import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-show-error',
  imports: [CommonModule, SharedTranslocoModule],
  templateUrl: './show-error.component.html',
})
export class ShowErrorComponent {
  label: InputSignal<string> = input('');
  errors: InputSignal<ValidationErrors> = input.required<ValidationErrors>({});
  inputLimit: InputSignal<number> = input(11);
  decimalLimit: InputSignal<number> = input(2);
  charLimit: InputSignal<number> = input(1000);
}
