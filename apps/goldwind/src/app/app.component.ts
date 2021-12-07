import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { getIsLoggedIn, getUsername } from '@schaeffler/azure-auth';
import { FooterLink } from '@schaeffler/footer';
import { UserMenuEntry } from '@schaeffler/header';

import packageJson from '../../package.json';
import { environment } from '../environments/environment';
import { AppRoutePath } from './app-route-path.enum';
import { LegalPath } from './legal/legal-route-path.enum';

@Component({
  selector: 'goldwind-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Smart Wind Solutions';

  public metadata = {
    icpnumber: environment.icpnumber,
    publicSecurityBureauNumber: environment.publicSecurityBureauNumber,
  };
  public footerLinks: FooterLink[] = [
    {
      link: `mailto:smartwindsolutions@schaeffler.com?subject=Support%20Request&body=Dear%20Smart%20Wind%20Solutions%20Support%2C%0Ai%20have%20the%20following%20request...%0A%0AAttached%20you%27ll%20find%20a%20screenshot%0A%0AKind%20regards`,
      title: translate('app.contact'),
      external: true,
    },
    {
      link: `${AppRoutePath.LegalPath}/${LegalPath.LegalNoticePath}`,
      title: translate('app.legalnotice'),
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

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);
  }
}
