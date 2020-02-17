import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'sta-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  constructor(private readonly authService: AuthService) {}

  public login(): void {
    let targetUrl = '/';

    if (location.hash && location.hash.indexOf('#/') === 0) {
      targetUrl = location.hash.substr(2);
    }
    this.authService.login(targetUrl);
  }
}
