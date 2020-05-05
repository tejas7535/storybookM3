import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { UserMenuEntry } from '@schaeffler/header';
import { BreakpointService } from '@schaeffler/responsive';
import { getUsername, loginImplicitFlow } from '@schaeffler/shared/auth';

import { AppState } from './core/store';

@Component({
  selector: 'cdba-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Cost Database Analytics';

  username$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];

  isLessThanMediumViewport$: Observable<boolean>;

  public constructor(
    private readonly breakpointService: BreakpointService,
    private readonly store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.isLessThanMediumViewport$ = this.breakpointService.isLessThanMedium();
    this.username$ = this.store.pipe(select(getUsername));

    this.store.dispatch(loginImplicitFlow());
  }

  public handleReset(): void {
    console.log('RESET FILTERS');
    console.warn('Handle Filter in seperate component');
  }
}
