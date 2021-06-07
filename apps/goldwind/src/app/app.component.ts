import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';

import { getIsLoggedIn, getUsername } from '@schaeffler/azure-auth';
import { FooterLink } from '@schaeffler/footer-tailwind';
import { UserMenuEntry } from '@schaeffler/header';

import packageJson from '../../package.json';
import { AppRoutePath } from './app-route-path.enum';
import { AppState } from './core/store';
import { LegalPath } from './legal/legal-route-path.enum';

@Component({
  selector: 'goldwind-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Goldwind';

  public footerLinks: FooterLink[] = [
    {
      link: `${AppRoutePath.LegalPath}/${LegalPath.ImprintPath}`,
      title: translate('app.imprint'),
      external: false,
    },
    {
      link: `${AppRoutePath.LegalPath}/${LegalPath.DataprivacyPath}`,
      title: translate('app.dataPrivacy'),
      external: false,
    },
    {
      link: `${AppRoutePath.LegalPath}/${LegalPath.TermsPath}`,
      title: translate('app.termsOfUse'),
      external: false,
    },
  ];

  public appVersion = packageJson.version;

  username$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];
  isLoggedIn$: Observable<boolean>;

  public constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.isLoggedIn$ = this.store.pipe(select(getIsLoggedIn));
  }
}
