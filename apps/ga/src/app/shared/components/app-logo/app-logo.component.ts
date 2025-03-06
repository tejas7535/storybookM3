import { Component, Input } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ga-app-logo',
  templateUrl: './app-logo.component.html',
  imports: [SharedTranslocoModule],
})
export class AppLogoComponent {
  @Input() showText = true;
}
