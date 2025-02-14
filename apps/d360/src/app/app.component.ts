import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateAdapter } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
  RouterModule,
} from '@angular/router';

import { map, Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { translate, TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { AppShellFooterLink, AppShellModule } from '@schaeffler/app-shell';
import { getProfileImage, getUsername } from '@schaeffler/azure-auth';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MaintenanceModule } from '@schaeffler/empty-states';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import packageJson from '../../package.json';
import { appRoutes } from './app.routes';
import { AppRoutePath } from './app.routes.enum';
import { GlobalSelectionStateService } from './shared/components/global-selection-criteria/global-selection-state.service';
import { TabBarNavigationComponent } from './shared/components/page/tab-bar-navigation/tab-bar-navigation.component';
import { UserSettingsComponent } from './shared/components/user-settings/user-settings.component';
import {
  DATE_FNS_LOOKUP,
  LocaleType,
} from './shared/constants/available-locales';
import { UserService } from './shared/services/user.service';
import { ValidationHelper } from './shared/utils/validation/validation-helper';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    AppShellModule,
    MaintenanceModule,
    SharedTranslocoModule,
    PushPipe,
    UserSettingsComponent,
    TabBarNavigationComponent,
    MatTabsModule,
    CommonModule,
  ],
  selector: 'd360-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly dateAdapter: DateAdapter<Date> = inject(DateAdapter);
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);
  private readonly authService: MsalService = inject(MsalService);
  private readonly msalBroadcastService: MsalBroadcastService =
    inject(MsalBroadcastService);
  private readonly store: Store = inject(Store);
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly globalSelectionStateService: GlobalSelectionStateService =
    inject(GlobalSelectionStateService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected activeUrl = signal('/');

  protected title = computed(() => {
    const routeTitles = [
      { routes: appRoutes.functions.salesSuite, key: 'tabbarMenu.salesSuite' },
      {
        routes: appRoutes.functions.demandSuite,
        key: 'tabbarMenu.demandSuite',
      },
    ];

    for (const { routes, key } of routeTitles) {
      if (
        routes
          .map((route) => route.path.toLowerCase())
          .includes(this.activeUrl())
      ) {
        return [translate('header.fullTitle'), translate(key)].join(' | ');
      }
    }

    return translate('header.fullTitle');
  });
  protected titleLink = AppRoutePath.Root;
  protected appVersion = packageJson.version;

  protected username$: Observable<string>;
  protected profileImage$: Observable<string>;
  protected isTabNavigationVisible$: Observable<boolean>;

  protected footerLinks: AppShellFooterLink[] = [
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
      link: 'https://worksite.sharepoint.com/:u:/r/sites/Bearings-Industrial-Solutions-Sales-Operations-Planning/SitePages/Synchronized-Sales-%26-Demand-Planning---Overview.aspx?csf=1&web=1&e=Gal3OO',
      title: 'Planning360@MySchaeffler',
      external: true,
    },
    {
      link: 'https://schaefflerprod.service-now.com/sup?id=sc_cat_item&sys_id=2d1e91cfdb5ba20038c2b6bffe961953&sysparm_category=19634e32dbb73e00d624b14ffe961977',
      title: 'Planning360@ServiceNow',
      external: true,
    },
  ];

  public constructor() {
    this.userService.loadRegion().subscribe();
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeUrl.set(this.getRelativeUrl(event.url));
      }
    });

    // set date locale
    this.translocoLocaleService.localeChanges$
      .pipe(takeUntilDestroyed())
      .subscribe((locale) =>
        this.dateAdapter.setLocale(
          DATE_FNS_LOOKUP?.[locale as LocaleType] ?? DATE_FNS_LOOKUP['en-US']
        )
      );

    this.activatedRoute.queryParams
      .pipe(
        switchMap((params: Params) =>
          this.globalSelectionStateService.handleQueryParams$(params)
        ),
        tap(() => (location.href = this.router.url.split('?')[0])),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.isTabNavigationVisible$ = this.showTabNavigationOnPage$();

    this.authService.handleRedirectObservable().subscribe();

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe(() => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        tap(() => this.checkAndSetActiveAccount()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    // add translocoLocaleService to static class.
    ValidationHelper.localeService = this.translocoLocaleService;
  }

  private checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    const activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      const accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  private showTabNavigationOnPage$(): Observable<boolean> {
    const routesWithTabNavigation = [
      appRoutes.root.path,
      appRoutes.todos.path,
      ...appRoutes.functions.salesSuite.map((route) => route.path),
      ...appRoutes.functions.demandSuite.map((route) => route.path),
      ...appRoutes.functions.general.map((route) => route.path),
    ];

    return this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const currentUrl = this.getRelativeUrl(event.url);

        return routesWithTabNavigation.some((route) =>
          new RegExp(route).test(currentUrl)
        );
      })
    );
  }

  /**
   * Strip everything from the given url expect the path.
   *
   * @private
   * @param {string} url
   * @return {string}
   * @memberof AppComponent
   */
  private getRelativeUrl(url: string): string {
    return url
      .toLowerCase()
      .replace(/^(?:\/\/|[^/]+)*\//, '')
      .split('?')[0];
  }
}
