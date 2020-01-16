import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { BreakpointService } from '@schaeffler/shared/responsive';
import { UserMenuEntry } from '@schaeffler/shared/ui-components';

import { AuthGuard } from './core/guards/auth.guard';
import * as fromStore from './core/store';

@Component({
  selector: 'ltp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public username = '';

  public userMenuEntries = [
    new UserMenuEntry('logout', translate('signOutBtn'))
  ];

  public isLessThanMediumViewPort$: Observable<boolean>;

  constructor(
    private readonly authGuard: AuthGuard,
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
    this.authGuard.signOut();
  }

  private handleObservables(): void {
    this.isLessThanMediumViewPort$ = this.breakpointService.isLessThanMedium();
  }

  private async getCurrentProfile(): Promise<void> {
    const profile = await this.authGuard.getCurrentProfile();
    this.username = `${profile.firstName} ${profile.lastName}`;
  }
}
