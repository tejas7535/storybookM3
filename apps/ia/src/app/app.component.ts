import { Component, OnInit } from '@angular/core';
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

import { AppRoutePath } from './app-route-path.enum';
import { isFeatureEnabled } from './shared/guards/is-feature-enabled';
import { SystemMessage } from './shared/models/system-message';
import { getSystemMessage } from './user/store/selectors/user.selector';

interface TabElem {
  label: string;
  path: string;
  disabled: boolean;
}
@Component({
  selector: 'ia-root',
  templateUrl: './app.component.html',
  styles: ['.mat-mdc-tab-link {@apply text-button; }'],
})
export class AppComponent implements OnInit {
  title = 'Insight Attrition';
  titleLink = '/';

  username$: Observable<string>;
  profileImage$: Observable<string>;
  isLoggedIn$: Observable<boolean>;

  isLegalRouteActive$: Observable<boolean>;
  isCookieRouteActive$: Observable<boolean>;
  isFluctuationAnalyticsPageActive$: Observable<boolean>;

  systemMessage$: Observable<SystemMessage>;

  tabs: TabElem[] = [
    {
      label: 'overview',
      path: AppRoutePath.OverviewPath,
      disabled: false,
    },
    {
      label: 'drillDown',
      path: AppRoutePath.DrillDownPath,
      disabled: false,
    },
    {
      label: 'lossOfSkill',
      path: AppRoutePath.LossOfSkillPath,
      disabled: false,
    },
    {
      label: 'reasonsAndCounterMeasures',
      path: AppRoutePath.ReasonsForLeavingPath,
      disabled: false,
    },
    {
      label: 'fluctuationAnalytics',
      path: AppRoutePath.FluctuationAnalyticsPath,
      disabled: !isFeatureEnabled(),
    },
  ];

  footerLinks: AppShellFooterLink[] = [
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

  // eslint-disable-next-line no-useless-escape
  private readonly legalRouteRegExp = new RegExp(`^\/${LegalRoute}\/.*`);

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly oneTrustService: OneTrustService
  ) {}

  ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);

    this.handleCurrentRoute();

    // use transloco to set the translation of the banner
    this.translocoService.langChanges$.subscribe((language) => {
      this.oneTrustService.translateBanner(language, true);
    });

    this.systemMessage$ = this.store.select(getSystemMessage);
  }

  handleCurrentRoute(): void {
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

    // check if current route is a legal route
    this.isLegalRouteActive$ = merge(initialLoad, routerEvents).pipe(
      map((url) => url.match(this.legalRouteRegExp) !== null)
    );

    // check if current route is cookie page
    this.isCookieRouteActive$ = merge(initialLoad, routerEvents).pipe(
      map((url) => url.split('/').pop() === LegalPath.CookiePath)
    );

    // check if current route is fluctuation analytics
    this.isFluctuationAnalyticsPageActive$ = merge(
      initialLoad,
      routerEvents
    ).pipe(
      map(
        (url) => url.split('/').pop() === AppRoutePath.FluctuationAnalyticsPath
      )
    );
  }
}
