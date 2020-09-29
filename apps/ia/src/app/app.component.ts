import { Component } from '@angular/core';

import { UserMenuEntry } from '@schaeffler/header';

@Component({
  selector: 'ia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Insight Attrition';

  username = 'User Name'; // should come from auth store
  userMenuEntries: UserMenuEntry[] = [];
}
