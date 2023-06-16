import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@Component({
  selector: 'ea-info-button',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule],
  templateUrl: './info-button.component.html',
})
export class InfoButtonComponent {
  @Input() tooltip: string | undefined;
}
