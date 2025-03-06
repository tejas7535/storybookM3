import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'd360-field-error',
  imports: [MatInputModule],
  templateUrl: './field-error.component.html',
})
export class FieldErrorComponent {
  @Input() errorMessages: string[] = [];
  @Input() nonErrorText!: string;
}
