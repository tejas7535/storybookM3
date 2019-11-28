import { Component } from '@angular/core';

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

  public toggleSidebar(): void {}

  public onChangeSettingsSidebar(ev): void {}
}
