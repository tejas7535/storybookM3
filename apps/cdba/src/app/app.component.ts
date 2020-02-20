import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { BreakpointService } from '@schaeffler/shared/responsive';
import { UserMenuEntry } from '@schaeffler/shared/ui-components';

@Component({
  selector: 'cdba-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Cost Database Analytics';

  username = 'Test User';
  userMenuEntries: UserMenuEntry[] = [];

  isLessThanMediumViewport$: Observable<boolean>;

  constructor(private readonly breakpointService: BreakpointService) {}

  public ngOnInit(): void {
    this.isLessThanMediumViewport$ = this.breakpointService.isLessThanMedium();
  }

  public handleReset(): void {
    console.log('RESET FILTERS');
    console.warn('Handle Filter in seperate component');
  }
}
