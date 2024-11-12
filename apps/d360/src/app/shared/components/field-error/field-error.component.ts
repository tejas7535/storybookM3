import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'd360-field-error',
  standalone: true,
  imports: [MatInputModule],
  templateUrl: './field-error.component.html',
  styleUrls: ['./field-error.component.scss'],
})
export class FieldErrorComponent {
  @Input() errorMessages: string[] = [];
  @Input() nonErrorText!: string;
}
