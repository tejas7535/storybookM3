import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getIsLoggedIn, getUsername, startLoginFlow } from '@schaeffler/auth';
import { FooterLink } from '@schaeffler/footer';
import { UserMenuEntry } from '@schaeffler/header';
import { BreakpointService } from '@schaeffler/responsive';

import { MatDialog } from '@angular/material/dialog';
import { BrowserSupportDialogComponent } from '@cdba/shared/components/browser-support-dialog/browser-support-dialog.component';
import { BrowserDetectionService } from '@cdba/shared/services';
import { tap } from 'rxjs/operators';
import { version } from '../../package.json';
import { AppState } from './core/store';

@Component({
  selector: 'cdba-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Cost Database Analytics';

  public appVersion = version;
  public footerLinks: FooterLink[] = [
    {
      link: 'https://sconnect.schaeffler.com/groups/cost-database-analytics',
      title: 'CDBA @ sConnect',
      external: true,
    },
  ];

  username$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];
  isLoggedIn$: Observable<boolean>;

  isLessThanMediumViewport$: Observable<boolean>;

  public constructor(
    private readonly breakpointService: BreakpointService,
    private readonly browserDetectionService: BrowserDetectionService,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.isLessThanMediumViewport$ = this.breakpointService.isLessThanMedium();
    this.username$ = this.store.pipe(select(getUsername));
    this.isLoggedIn$ = this.store.pipe(
      select(getIsLoggedIn),
      tap((loggedIn) => {
        if (loggedIn && this.browserDetectionService.isUnsupportedBrowser()) {
          this.dialog.open(BrowserSupportDialogComponent, {
            hasBackdrop: true,
            disableClose: true,
            maxWidth: 400,
          });
        }
      })
    );

    this.store.dispatch(startLoginFlow());
  }
}
