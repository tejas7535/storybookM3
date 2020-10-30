import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getUsername, startLoginFlow } from '@schaeffler/auth';
import { UserMenuEntry } from '@schaeffler/header';

import { AppState } from './core/store';

@Component({
  selector: 'gq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Guided Quoting';

  username$: Observable<string>;

  userMenuEntries: UserMenuEntry[] = [];
  public constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.store.dispatch(startLoginFlow());
  }
}
