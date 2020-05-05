import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { UserMenuEntry } from '@schaeffler/header';
import { BreakpointService } from '@schaeffler/responsive';

import { AuthService } from './core/services';
import * as fromStore from './core/store';

@Component({
  selector: 'ltp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public username$: Observable<string>;

  public userMenuEntries = [
    new UserMenuEntry('logout', translate('signOutBtn')),
  ];

  public isLessThanMediumViewPort$: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store<fromStore.LTPState>,
    private readonly breakpointService: BreakpointService
  ) {}

  public ngOnInit(): void {
    this.getCurrentProfile();
    this.handleObservables();
  }

  public handleReset(): void {
    this.store.dispatch(fromStore.unsetPredictionRequest());
    this.store.dispatch(fromStore.unsetDisplay());
  }

  public userMenuClicked(key: string): void {
    if (key === 'logout') {
      this.logout();
    }
  }

  public logout(): void {
    this.authService.logout();
  }

  private handleObservables(): void {
    this.isLessThanMediumViewPort$ = this.breakpointService.isLessThanMedium();
  }

  private getCurrentProfile(): void {
    this.username$ = this.authService.getUserName();
  }
}
