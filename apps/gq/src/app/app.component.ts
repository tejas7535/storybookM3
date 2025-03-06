/* eslint-disable ngrx/avoid-mapping-selectors */
import {
  Component,
  HostListener,
  inject,
  OnInit,
  Optional,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map, merge, Observable, of, take } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import packageJson from '../../package.json';
import { AppRoutePath } from './app-route-path.enum';
import { HealthCheckFacade } from './core/store/health-check/health-check.facade';
import { UserSettingsService } from './shared/services/rest/user-settings/user-settings.service';

@Component({
  selector: 'gq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);
  private readonly appInsightsService: ApplicationInsightsService = inject(
    ApplicationInsightsService
  );
  private readonly userSettingsService: UserSettingsService =
    inject(UserSettingsService);
  @Optional() private readonly oneTrustService: OneTrustService =
    inject(OneTrustService);
  readonly healthCheckFacade: HealthCheckFacade = inject(HealthCheckFacade);

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
      link: 'https://worksite.sharepoint.com/sites/Bearings-Industrial-Solutions-Sales-Management-Marketing/SitePages/Guided-Quoting.aspx',
      title: 'GQ@MySchaeffler',
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

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(): void {
    this.userSettingsService.updateUserSettings();
  }

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

    window.addEventListener('beforeunload', this.handleBeforeUnload);
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
