import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getProfileImage, getUsername } from '@schaeffler/azure-auth';

import { AppState } from './core/store/reducers/reducer';

@Component({
  selector: 'schaeffler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public platformTitle = 'Hello World Azure';

  public username$: Observable<string>;
  public profileImage$: Observable<string>;

  public constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.profileImage$ = this.store.pipe(select(getProfileImage));
  }
}
