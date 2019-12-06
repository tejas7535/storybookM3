import { Component } from '@angular/core';

import { AuthService } from './core/auth.service';

@Component({
  selector: 'sta-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public title = 'Schaeffler Text Assistant';
  public username = 'User';
  public home = '/';
  public settingsSidebarOpen = false;

  public sidebarElements = [
    {
      text: 'HOME',
      icon: 'icon-house',
      link: '/'
    },
    {
      text: 'Auto Tagging',
      icon: 'icon-bookmark',
      link: 'tagging'
    }
  ];

  public sidebarMode = 1;

  constructor(private readonly authService: AuthService) {
    this.authService.initAuth();
  }

  public toggleSidebar(): void {}

  public onChangeSettingsSidebar(ev): void {}
}
