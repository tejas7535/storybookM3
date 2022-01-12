import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';

@Component({
  selector: 'sedo-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'SeDo';

  username$: Observable<string>;
  profileImage$: Observable<string>;
  getIsLoggedIn$: Observable<boolean>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.getIsLoggedIn$ = this.store.select(getIsLoggedIn);
  }
}
