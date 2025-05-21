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

import { EMPTY, map, Observable, of } from 'rxjs';
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
import { appRoutes, getAllRoutes } from './app.routes';
import { AppRoutePath } from './app.routes.enum';
import { AlertService } from './feature/alerts/alert.service';
import { GlobalSelectionStateService } from './shared/components/global-selection-criteria/global-selection-state.service';
import { TabBarNavigationComponent } from './shared/components/page/tab-bar-navigation/tab-bar-navigation.component';
import { UserSettingsComponent } from './shared/components/user-settings/user-settings.component';
import {
  DATE_FNS_LOOKUP,
  LocaleType,
} from './shared/constants/available-locales';
import { UserService } from './shared/services/user.service';
import { StreamSaverService } from './shared/utils/service/stream-saver.service';
import { ValidationHelper } from './shared/utils/validation/validation-helper';

@Component({
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
  private readonly alertService: AlertService = inject(AlertService);
  private readonly userService: UserService = inject(UserService);
  private readonly streamSaverService: StreamSaverService =
    inject(StreamSaverService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  public readonly globalSelectionStateService: GlobalSelectionStateService =
    inject(GlobalSelectionStateService);

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
      link: 'https://worksite.sharepoint.com/:u:/r/sites/Bearings-Industrial-Solutions-Sales-Management-Marketing/SitePages/Planning360-Home.aspx?csf=1&web=1&e=q2rCbU',
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
    this.router.events
      .pipe(
        switchMap((event) => {
          if (event instanceof NavigationEnd) {
            this.activeUrl.set(this.getRelativeUrl(event.url));

            return this.activatedRoute.queryParams;
          }

          return EMPTY;
        }),
        switchMap((params: Params) => {
          if (Object.entries(params).length === 0) {
            return EMPTY;
          }

          // we dismiss the parameters:
          // if we have no module in the url, because we can't guess what the link should show up.
          if (['/', ''].includes(this.activeUrl())) {
            return of(true);
          }

          const foundRoute = getAllRoutes().find((route) =>
            [
              route.path,
              `/${route.path}`,
              `${route.path}/`,
              `/${route.path}/`,
            ].includes(this.activeUrl())
          );

          // we dismiss the parameters:
          // if the route has no global selection
          if (foundRoute?.data?.hasGlobalSelection) {
            return this.globalSelectionStateService.handleQueryParams$(params);
          } else if (foundRoute?.data?.hasSalesValidationSelection) {
            sessionStorage.setItem(
              AppRoutePath.SalesValidationPage,
              JSON.stringify(params)
            );
          } else if (
            foundRoute?.data?.hasTaskRulesSelection &&
            params?.['createNewTask']
          ) {
            sessionStorage.setItem(
              AppRoutePath.AlertRuleManagementPage,
              JSON.stringify({
                customerNumber: params?.['customerNumber'] || null,
                materialNumber: params?.['materialNumber'] || null,
                createNewTask: true,
              })
            );

            this.router.navigate([AppRoutePath.AlertRuleManagementPage], {
              onSameUrlNavigation: 'reload',
              skipLocationChange: false,
            });

            return EMPTY;
          }

          return of(true);
        }),
        tap(() => (location.href = this.router.url.split('?')[0])),
        takeUntilDestroyed()
      )
      .subscribe();

    // set date locale
    this.translocoLocaleService.localeChanges$
      .pipe(takeUntilDestroyed())
      .subscribe((locale) =>
        this.dateAdapter.setLocale(
          DATE_FNS_LOOKUP?.[locale as LocaleType] ?? DATE_FNS_LOOKUP['en-US']
        )
      );
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
            msg?.eventType === EventType.ACCOUNT_ADDED ||
            msg?.eventType === EventType.ACCOUNT_REMOVED
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

    this.alertService.init();
    this.userService.init();
    this.streamSaverService.init();

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
      this.authService.instance.getAllAccounts()?.length > 0
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
