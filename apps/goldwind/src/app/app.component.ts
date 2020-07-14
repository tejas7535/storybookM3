import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { UserMenuEntry } from '@schaeffler/header';
import { getUsername, startLoginFlow } from '@schaeffler/shared/auth';

import { AppState } from './core/store';

@Component({
  selector: 'goldwind-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Goldwind';

  username$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];

  public constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));

    this.store.dispatch(startLoginFlow());
  }
}
