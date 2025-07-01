/* eslint-disable ngrx/avoid-mapping-selectors */
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

import {
  combineLatest,
  debounceTime,
  filter,
  map,
  merge,
  Observable,
  of,
  pairwise,
  switchMap,
  take,
} from 'rxjs';

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
import { ActiveCaseFacade } from './core/store/active-case/active-case.facade';
import { RolesFacade } from './core/store/facades/roles.facade';
import { HealthCheckFacade } from './core/store/health-check/health-check.facade';
import {
  getRouteQueryParams,
  getRouteUrl,
} from './core/store/selectors/router/router.selector';
import { UserSettingsStore } from './core/store/user-settings/user-settings.store';
import { IpExposureComponent } from './shared/components/ip-exposure/ip-exposure.component';
import { Customer } from './shared/models';

@Component({
  selector: 'gq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly rolesFacade = inject(RolesFacade);
  private readonly userSettingsStore = inject(UserSettingsStore);
  private readonly router: Router = inject(Router);
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);
  private readonly appInsightsService: ApplicationInsightsService = inject(
    ApplicationInsightsService
  );
  private readonly dialog = inject(MatDialog);

  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
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
      link: 'https://worksite.sharepoint.com/sites/Bearings-Industrial-Solutions-Sales-Management-Marketing/SitePages/Guided-Quoting---Training-Material-%26-FAQ.aspx',
      title: this.translocoService.translate('legal.trainingMaterial'),
      external: true,
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

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);

    this.handleCurrentRoute();

    this.appInsightsService.addCustomPropertyToTelemetryData(
      'appVersion',
      this.appVersion
    );

    this.handleIpExposureDialog();

    this.rolesFacade.isLoggedIn$
      .pipe(filter((isLoggedIn) => isLoggedIn))
      .subscribe(() => this.userSettingsStore.loadUserSettings());
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

    this.showGlobalSearch$ = merge(initialLoad, routerEvents).pipe(
      map((url) => url.startsWith(`/${AppRoutePath.CaseViewPath}`))
    );
  }

  private handleIpExposureDialog() {
    this.store
      .select(getRouteUrl)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        pairwise(),
        filter(this.shouldOpenIpExposureDialog),
        switchMap(() => this.waitUntilQuotationCustomerLoaded()),
        debounceTime(1000)
      )
      .subscribe((customer) => {
        this.openIpExposureDialog(customer);
      });
  }

  private shouldOpenIpExposureDialog([prev, curr]: [
    string | undefined,
    string | undefined,
  ]): boolean {
    const routeHasChangedOrIsFirstLoad = prev !== curr && prev === undefined;

    const notPreviousRouteIsProcessCaseAndCaseDetail =
      !prev?.includes(AppRoutePath.DetailViewPath) &&
      !prev?.includes(AppRoutePath.ProcessCaseViewPath);

    const isCurrentRouteProcessCaseOrCaseDetail =
      curr?.includes(AppRoutePath.DetailViewPath) ||
      curr?.includes(AppRoutePath.ProcessCaseViewPath);

    return (
      routeHasChangedOrIsFirstLoad ||
      (notPreviousRouteIsProcessCaseAndCaseDetail &&
        isCurrentRouteProcessCaseOrCaseDetail)
    );
  }
  private waitUntilQuotationCustomerLoaded(): Observable<Customer> {
    return combineLatest([
      this.activeCaseFacade.quotationCustomer$,
      this.activeCaseFacade.quotationLoading$,
      this.activeCaseFacade.quotationIdentifier$,
      this.activeCaseFacade.quotation$,
      this.store.select(getRouteQueryParams),
    ]).pipe(
      filter(
        ([customer, loading, quoteId, quotation, queryParams]) =>
          !!customer &&
          !loading &&
          quoteId &&
          quotation &&
          quoteId.gqId.toString() === queryParams.quotation_number &&
          quotation.gqId === quoteId.gqId &&
          customer.identifier.customerId === queryParams.customer_number &&
          !quotation.calculationInProgress &&
          !quotation.sapCallInProgress
      ),
      map(([customer]) => customer),
      take(1)
    );
  }

  private openIpExposureDialog(customer: Customer): void {
    if (customer?.showIpExposure) {
      this.dialog.open(IpExposureComponent, {
        width: '620px',
      });
    }
  }
}
