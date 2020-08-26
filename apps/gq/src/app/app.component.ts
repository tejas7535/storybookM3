import { Component } from '@angular/core';

import { UserMenuEntry } from '@schaeffler/header';

@Component({
  selector: 'gq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Guided Quoting';

  username = 'User Name'; // should come from auth store
  userMenuEntries: UserMenuEntry[] = [];
}
