import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  BreakpointService,
  UserMenuEntry
} from '@schaeffler/shared/ui-components';

import { AuthGuard } from './core/guards/auth.guard';
import * as fromStore from './core/store';

@Component({
  selector: 'ltp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public username = '';

  public userMenuEntries = [];

  public isLessThanMediumViewPort$: Observable<boolean>;
  public title$: Observable<String>;

  constructor(
    private readonly translationService: TranslateService,
    private readonly authGuard: AuthGuard,
    private readonly store: Store<fromStore.LTPState>,
    private readonly breakpointService: BreakpointService
  ) {}

  public ngOnInit(): void {
    this.getCurrentProfile();

    this.initTranslation();

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

  private initTranslation(): void {
    this.translationService.setDefaultLang('en');
    this.translationService.use(this.translationService.getBrowserLang());
  }

  private handleObservables(): void {
    this.isLessThanMediumViewPort$ = this.breakpointService.isLessThanMedium();

    this.title$ = this.translationService.get('TITLE');

    this.translationService
      .get('SIGN_OUT_BTN')
      .subscribe(logout =>
        this.userMenuEntries.push(new UserMenuEntry('logout', logout))
      );
  }

  private async getCurrentProfile(): Promise<void> {
    const profile = await this.authGuard.getCurrentProfile();
    this.username = `${profile.firstName} ${profile.lastName}`;
  }
}
