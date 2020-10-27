import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getIsLoggedIn, getUsername, startLoginFlow } from '@schaeffler/auth';
import { UserMenuEntry } from '@schaeffler/header';

import { AppState } from './core/store/reducers';

@Component({
  selector: 'ia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Insight Attrition';

  username$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];
  getIsLoggedIn$: Observable<boolean>;

  public constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.getIsLoggedIn$ = this.store.pipe(select(getIsLoggedIn));

    this.store.dispatch(startLoginFlow());
  }
}
