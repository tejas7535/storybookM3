import { Component } from '@angular/core';

import { UserMenuEntry } from '@schaeffler/header';

@Component({
  selector: 'goldwind-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'GOLDWIND';

  username = 'User Name'; // should come from auth store
  userMenuEntries: UserMenuEntry[] = [];
}
