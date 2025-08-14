import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'gq-recalculation-data-item',
  templateUrl: './recalculation-data-item.component.html',
  imports: [CommonModule],
})
export class RecalculationDataItemComponent {
  caption: InputSignal<string> = input(null);
  value: InputSignal<string> = input(null);
}
