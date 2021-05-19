import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
import { FooterLink } from '@schaeffler/footer-tailwind';
import { UserMenuEntry } from '@schaeffler/header';

import { BrowserSupportDialogComponent } from '@cdba/shared/components/browser-support-dialog/browser-support-dialog.component';
import { BrowserDetectionService } from '@cdba/shared/services';

import { version } from '../../package.json';

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
  profileImage$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];
  isLoggedIn$: Observable<boolean>;

  public constructor(
    private readonly browserDetectionService: BrowserDetectionService,
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.isLoggedIn$ = this.store.select(getIsLoggedIn).pipe(
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
  }
}
