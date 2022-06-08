import { Component, Input } from '@angular/core';

@Component({
  selector: 'ga-app-logo',
  templateUrl: './app-logo.component.html',
})
export class AppLogoComponent {
  @Input() showText = true;
}
