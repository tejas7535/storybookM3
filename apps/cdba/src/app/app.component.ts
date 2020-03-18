import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { AuthService } from '@schaeffler/shared/auth';
import { BreakpointService } from '@schaeffler/shared/responsive';
import { UserMenuEntry } from '@schaeffler/shared/ui-components';

import { AppState, getUsername, login, loginSuccess } from './core/store';

@Component({
  selector: 'cdba-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Cost Database Analytics';

  username$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];

  isLessThanMediumViewport$: Observable<boolean>;

  public constructor(
    private readonly breakpointService: BreakpointService,
    private readonly authService: AuthService,
    private readonly store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.isLessThanMediumViewport$ = this.breakpointService.isLessThanMedium();
    this.username$ = this.store.pipe(select(getUsername));

    this.initImplicitFlow();

    this.tryLogin();
  }

  public handleReset(): void {
    console.log('RESET FILTERS');
    console.warn('Handle Filter in seperate component');
  }

  private tryLogin(): void {
    if (!this.authService.hasValidAccessToken()) {
      this.store.dispatch(login());
    }
  }

  private async initImplicitFlow(): Promise<void> {
    const loginSuccesful = await this.authService.configureImplicitFlow();

    if (loginSuccesful) {
      const user = this.authService.getUser();
      this.store.dispatch(loginSuccess({ user }));
    }
  }
}
