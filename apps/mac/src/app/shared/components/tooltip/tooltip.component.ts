import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'mac-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [MatButtonModule, MatTooltipModule, MatIconModule],
})
export class TooltipComponent {
  @Input() content: string;
  @Input() color: string;
  @Input() manualcolor: string;
  @Input() icon: string;
}
