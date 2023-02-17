import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'gq-info-banner',
  templateUrl: './info-banner.component.html',
  imports: [MatIconModule],
})
export class InfoBannerComponent {
  @Input() infoText: string;
}
