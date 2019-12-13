import { Component, Input } from '@angular/core';

@Component({
  selector: 'ltp-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input() content: string;
  @Input() color: string;
  @Input() manualcolor: string;
  @Input() icon: string;
}
