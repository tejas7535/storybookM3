import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'gq-info-icon',
  templateUrl: './info-icon.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
})
export class InfoIconComponent {
  @Input() showHelpIcon: boolean;
  @Input() displaySmall: boolean;
  @Input() text: string;
}
