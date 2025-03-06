import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'schaeffler-info-button',
  imports: [MatTooltipModule, MatIconModule],
  templateUrl: './info-button.component.html',
})
export class InfoButtonComponent {
  @Input() public tooltip: string | undefined;
  @Input() public tooltipPosition:
    | 'left'
    | 'right'
    | 'above'
    | 'below'
    | 'before'
    | 'after' = 'below';
  @Input() public tooltipClass = '';
  @Input() public inline = false;
}
