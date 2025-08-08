import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-no-data',
  templateUrl: './no-data.component.html',
  imports: [CommonModule],
})
export class NoDataComponent {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() showBorder = true;
}
