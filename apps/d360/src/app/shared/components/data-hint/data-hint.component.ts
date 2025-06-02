import { Component, input, InputSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'd360-data-hint',
  imports: [MatCardModule],
  templateUrl: './data-hint.component.html',
  styleUrls: ['./data-hint.component.scss'],
})
export class DataHintComponent {
  public text: InputSignal<string> = input<string>('');
}
