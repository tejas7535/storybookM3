import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'ea-info-button',
  imports: [MatTooltipModule, MatIconModule, CommonModule],
  templateUrl: './info-button.component.html',
})
export class InfoButtonComponent {
  @Input() tooltip: string | undefined;
  @Input() tooltipPosition:
    | 'left'
    | 'right'
    | 'above'
    | 'below'
    | 'before'
    | 'after' = 'below';
  @Input() tooltipClass = '';
  @Input() inline = false;
}
