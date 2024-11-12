import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'd360-data-hint',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './data-hint.component.html',
  styleUrls: ['./data-hint.component.scss'],
})
export class DataHintComponent {
  @Input() text = '';
}
