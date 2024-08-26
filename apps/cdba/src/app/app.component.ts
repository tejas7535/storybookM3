import { Component, OnInit, Optional } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map, merge, Observable, of, take } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { translate, TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { RoleFacade } from '@cdba/core/auth/role.facade';

import packageJson from '../../package.json';
import { URL_FAQ, URL_MY_SCHAEFFLER } from '../app/shared/constants/urls';
import { AppRoutePath } from './app-route-path.enum';

@Component({
  selector: 'cdba-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Cost Database Analytics';
  titleLink = AppRoutePath.SearchPath;
  footerLinks: AppShellFooterLink[] = [
    {
      link: URL_FAQ,
      title: 'FAQs',
      external: true,
    },
    {
      link: URL_MY_SCHAEFFLER,
      title: 'CDBA@MySchaeffler',
      external: true,
    },
    {
      link: `${LegalRoute}/${LegalPath.ImprintPath}`,
      title: translate('legal.imprint'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
      title: translate('legal.dataPrivacy'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.TermsPath}`,
      title: translate('legal.termsOfUse'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.CookiePath}`,
      title: translate('legal.cookiePolicy'),
      external: false,
    },
  ];
  appVersion = packageJson.version;

  isLoggedIn$ = this.store.select(getIsLoggedIn);
  username$ = this.store.select(getUsername);
  profileImage$ = this.store.select(getProfileImage);
  hasBetaUserRole$ = this.roleFacade.hasBetaUserRole$;
  showCookiesSettings$: Observable<boolean>;

  private readonly cookiesRegExp = new RegExp(
    // eslint-disable-next-line no-useless-escape
    `^\/${LegalRoute}\/cookie-policy.*`
  );

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly roleFacade: RoleFacade,
    private readonly translocoService: TranslocoService,
    @Optional() private readonly oneTrustService: OneTrustService
  ) {}

  public ngOnInit(): void {
    this.translocoService.langChanges$.subscribe((language) => {
      this.oneTrustService?.translateBanner(language, true);
    });
    this.determineShowCookiesSettings();
  }

  private determineShowCookiesSettings(): void {
    // on first load app component loads after router event
    const initialLoad = of(this.router).pipe(
      take(1),
      map((router) => router.url)
    );

    // listen to all subsequent route changes
    const routerEvents = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as unknown as NavigationEnd)?.url)
    );

    // check if current page is cookie page
    this.showCookiesSettings$ = merge(initialLoad, routerEvents).pipe(
      map((url) => url.match(this.cookiesRegExp) !== null)
    );
  }
}
