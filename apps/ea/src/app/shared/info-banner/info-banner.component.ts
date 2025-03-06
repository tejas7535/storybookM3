import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ea-info-banner',
  templateUrl: './info-banner.component.html',
  imports: [MatIconModule, CommonModule],
})
export class InfoBannerComponent {
  @Input() infoText?: string;
  @Input() isWarning? = false;
}
