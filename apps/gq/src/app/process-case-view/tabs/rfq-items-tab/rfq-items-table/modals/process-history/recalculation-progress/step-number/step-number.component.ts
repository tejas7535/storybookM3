import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

import { StepColor } from './models/step-color.enum';

@Component({
  selector: 'gq-step-number',
  templateUrl: './step-number.component.html',
  imports: [CommonModule],
})
export class StepNumberComponent {
  value: InputSignal<string> = input<string>(null);
  title: InputSignal<string> = input<string>(null);
  status: InputSignal<StepColor> = input<StepColor>(StepColor.INACTIVE);

  statusEnum = StepColor;
}
