import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
import { UserMenuEntry } from '@schaeffler/header';

import { AppState } from './core/store/reducers';

@Component({
  selector: 'sedo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SeDo';

  username$: Observable<string>;
  profileImage$: Observable<string>;
  getIsLoggedIn$: Observable<boolean>;
  userMenuEntries: UserMenuEntry[] = [];

  public constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.profileImage$ = this.store.pipe(select(getProfileImage));
    this.getIsLoggedIn$ = this.store.pipe(select(getIsLoggedIn));
  }
}
