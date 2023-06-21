import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ICalculationResultMessageComponent } from './calculation-result-message.component.interface';

@Component({
  selector: 'ea-calculation-result-message',
  templateUrl: './calculation-result-message.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class CalculationResultMessageComponent
  implements ICalculationResultMessageComponent
{
  @Input() title?: string;
  @Input() item?: {
    messages?: string[];
    subItems?: ICalculationResultMessageComponent[];
  };
}
