import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map, merge, Observable, of, take } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { AppRoutePath } from './app-route-path.enum';

interface TabElem {
  label: string;
  path: string;
  disabled: boolean;
}
@Component({
  selector: 'ia-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Insight Attrition';

  username$: Observable<string>;
  profileImage$: Observable<string>;
  isLoggedIn$: Observable<boolean>;

  isLegalRouteActive$: Observable<boolean>;
  isCookieRouteActive$: Observable<boolean>;
  // eslint-disable-next-line no-useless-escape
  private readonly legalRouteRegExp = new RegExp(`^\/${LegalRoute}\/.*`);

  tabs: TabElem[] = [
    {
      label: 'overview',
      path: AppRoutePath.OverviewPath,
      disabled: false,
    },
    {
      label: 'organizationalView',
      path: AppRoutePath.OrganizationalViewPath,
      disabled: false,
    },
    {
      label: 'lossOfSkill',
      path: AppRoutePath.LossOfSkillPath,
      disabled: false,
    },
    {
      label: 'reasonsAndCounterMeasures',
      path: AppRoutePath.ReasonsAndCounterMeasuresPath,
      disabled: false,
    },
    {
      label: 'fluctuationAnalytics',
      path: AppRoutePath.FluctuationAnalyticsPath,
      disabled: false,
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
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);

    this.handleCurrentRoute();
  }

  trackByFn(index: number): number {
    return index;
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
  }
}
