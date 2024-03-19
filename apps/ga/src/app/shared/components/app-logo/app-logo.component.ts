import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ga-app-logo',
  templateUrl: './app-logo.component.html',
  imports: [CommonModule, SharedTranslocoModule],
  standalone: true,
})
export class AppLogoComponent {
  @Input() showText = true;
}
