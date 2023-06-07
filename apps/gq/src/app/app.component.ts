/* eslint-disable ngrx/avoid-mapping-selectors */
import { Component, OnInit, Optional } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map, merge, Observable, of, take } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import packageJson from '../../package.json';
import { AppRoutePath } from './app-route-path.enum';
import { HealthCheckFacade } from './core/store/health-check/health-check.facade';

@Component({
  selector: 'gq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Guided Quoting';
  titleLink = AppRoutePath.CaseViewPath;

  public isCookiePage = false;
  public appVersion = packageJson.version;
  public footerLinks: AppShellFooterLink[] = [
    {
      link: `${LegalRoute}/${LegalPath.ImprintPath}`,
      title: this.translocoService.translate('legal.imprint'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
      title: this.translocoService.translate('legal.dataPrivacy'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.TermsPath}`,
      title: this.translocoService.translate('legal.termsOfUse'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.CookiePath}`,
      title: this.translocoService.translate('legal.cookiePolicy'),
      external: false,
    },
    {
      link: 'https://sconnect.schaeffler.com/groups/guided-quoting',
      title: 'GQ@SConnect',
      external: true,
    },
    {
      link: 'https://schaefflerprod.service-now.com/sup?id=sc_cat_item&sys_id=2d1e91cfdb5ba20038c2b6bffe961953&sysparm_category=19634e32dbb73e00d624b14ffe961977',
      title: 'GQ@ServiceNow',
      external: true,
    },
  ];

  profileImage$: Observable<string>;
  username$: Observable<string>;
  isLoggedIn$: Observable<boolean>;
  isCookieRouteActive$: Observable<boolean>;
  showGlobalSearch$: Observable<boolean>;

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly appInsightsService: ApplicationInsightsService,
    @Optional() private readonly oneTrustService: OneTrustService,
    readonly healthCheckFacade: HealthCheckFacade
  ) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);

    this.handleCurrentRoute();

    this.translocoService.langChanges$.subscribe((language) => {
      this.oneTrustService?.translateBanner(language, true);
    });

    this.appInsightsService.addCustomPropertyToTelemetryData(
      'appVersion',
      this.appVersion
    );
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
    // check if current route is cookie page
    this.isCookieRouteActive$ = merge(initialLoad, routerEvents).pipe(
      map((url) => url.split('/').pop() === LegalPath.CookiePath)
    );

    this.showGlobalSearch$ = merge(initialLoad, routerEvents).pipe(
      map((url) => url.startsWith(`/${AppRoutePath.CaseViewPath}`))
    );
  }
}
