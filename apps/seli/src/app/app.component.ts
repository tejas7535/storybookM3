import { Component } from '@angular/core';

import { UserMenuEntry } from '@schaeffler/header';

@Component({
  selector: 'seli-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SELI';

  username = 'User Name'; // should come from auth store
  userMenuEntries: UserMenuEntry[] = [];
}
