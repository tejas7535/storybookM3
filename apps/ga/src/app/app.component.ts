import { DOCUMENT } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { filter, startWith, Subject, take, takeUntil } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LegalPath } from '@schaeffler/legal-pages';

import {
  CalculationParametersFacade,
  selectBearing,
  SettingsFacade,
  StorageMessagesActions,
} from '@ga/core/store';

import packageJson from '../../package.json';
import { getAppFooterLinks } from './core/helpers/app-config-helpers';
import { OneTrustMobileService } from './core/services/tracking/one-trust-mobile.service';
import {
  setAppDelivery,
  setAppLanguage,
} from './core/store/actions/settings/settings.actions';
import { ScanDialogComponent } from './features/dmc-scanner/scan-dialog.component';
import { TRACKING_NAME_LANGUAGE } from './shared/constants';
import { AppDelivery, PartnerVersion } from './shared/models';
import { AppAnalyticsService } from './shared/services/app-analytics-service/app-analytics-service';
import { MobileFirebaseAnalyticsService } from './shared/services/mobile-firebase-analytics/mobile-firebase-analytics.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'grease-app',
  templateUrl: './app.component.html',
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  private readonly metaService = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly applicationInsightsService = inject(
    ApplicationInsightsService
  );
  private readonly settingsFacade = inject(SettingsFacade);
  private readonly appAnalyticsService = inject(AppAnalyticsService);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly oneTrustMobileService = inject(OneTrustMobileService);
  private readonly firebaseAnalyticsService = inject(
    MobileFirebaseAnalyticsService
  );
  private readonly oneTrustService = inject(OneTrustService, {
    optional: true,
  });
  private readonly document = inject(DOCUMENT);
  private readonly calculationParametersFacade = inject(
    CalculationParametersFacade
  );

  public standalone = input<boolean>(false);
  public bearing = input<string | undefined>();
  public language = input<string | undefined>();

  public appTitle = 'Grease App';
  public destroy$: Subject<void> = new Subject<void>();
  public isCookiePage = false;
  public footerLinks: AppShellFooterLink[] = [];
  public currentLanguage!: string;
  appVersion = packageJson.version;
  public appIsEmbedded$ = this.settingsFacade.appIsEmbedded$;
  public partnerVersion$ = this.settingsFacade.partnerVersion$;
  public internalUser$ = this.settingsFacade.internalUser$;

  public constructor() {
    effect(() => {
      if (!this.standalone()) {
        this.translocoService.setActiveLang(
          this.language() || this.currentLanguage
        );
        this.store.dispatch(
          setAppDelivery({ appDelivery: AppDelivery.Embedded })
        );
        if (this.bearing()) {
          this.store.dispatch(selectBearing({ bearing: this.bearing() }));
        }
      }
    });
  }

  public ngOnInit(): void {
    this.currentLanguage = this.translocoService.getActiveLang();
    this.assignMetaTags();
    this.assignFooterLinks();
    this.updateLangAttribute(this.currentLanguage);
    this.partnerVersion$.pipe(take(1)).subscribe((partnerVersion) => {
      this.applicationInsightsService.addCustomPropertyToTelemetryData(
        'partnerVersion',
        partnerVersion
      );
      this.assignPartnerVersionTheme(partnerVersion);
    });

    this.internalUser$
      .pipe(
        filter((internalUser: boolean) => internalUser !== undefined),
        take(1)
      )
      .subscribe((internalUser) => {
        this.applicationInsightsService.addCustomPropertyToTelemetryData(
          'internalUser',
          internalUser.toString()
        );
      });

    this.translocoService.events$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (event) =>
            event.type === 'translationLoadSuccess' && !event.wasFailure
        )
      )
      .subscribe(() => {
        this.assignAppTitle();
        this.assignMetaTags();
        this.assignFooterLinks();
      });

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        this.assignAppTitle();
        this.assignMetaTags();
        this.assignFooterLinks();
        this.oneTrustService?.translateBanner(language, true);
        this.store.dispatch(setAppLanguage({ language }));
        if (language !== this.currentLanguage) {
          this.currentLanguage = language;
          this.trackLanguage(language);
          this.updateLangAttribute(language);
        }
      });

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationEnd),
        startWith('')
      )
      .subscribe((event) => {
        const url = (event as NavigationEnd).url?.split('/').pop();

        this.isCookiePage = url === LegalPath.CookiePath;

        if (url === 'scan') {
          this.openScanDialog();
        }
      });

    if (this.appAnalyticsService.shouldLogEvents()) {
      this.router.events
        .pipe(
          takeUntil(this.destroy$),
          filter((event) => event instanceof NavigationEnd)
        )
        .subscribe((event) => {
          this.appAnalyticsService.logNavigationEvent(
            (event as NavigationEnd).url
          );
        });
    }

    this.store.dispatch(StorageMessagesActions.getStorageMessage());

    this.calculationParametersFacade.loadAppGreases();

    if (
      !this.router.getCurrentNavigation() &&
      !this.router.lastSuccessfulNavigation
    ) {
      this.router.initialNavigation();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getPartnerVersionLogoUrl(partnerVersion: string): string {
    return `/assets/images/partner-version-logos/${partnerVersion}.png`;
  }

  private trackLanguage(language: string): void {
    this.applicationInsightsService.logEvent(TRACKING_NAME_LANGUAGE, {
      value: language,
    });
  }

  private assignAppTitle(): void {
    this.appTitle = this.translocoService.translate('appTitle');
  }

  private assignFooterLinks(): void {
    this.footerLinks = getAppFooterLinks(this.oneTrustMobileService);
  }

  private assignMetaTags(): void {
    const translatedTitle = this.translocoService.translate('meta.title');
    const translatedSDescription =
      this.translocoService.translate('meta.description');

    this.titleService.setTitle(this.translocoService.translate('meta.title'));
    this.metaService.updateTag({ name: 'title', content: translatedTitle });
    this.metaService.updateTag({ name: 'og:title', content: translatedTitle });
    this.metaService.updateTag({
      name: 'twitter:title',
      content: translatedTitle,
    });
    this.metaService.updateTag({
      name: 'description',
      content: translatedSDescription,
    });
    this.metaService.updateTag({
      name: 'og:description',
      content: translatedSDescription,
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: translatedSDescription,
    });
  }

  private assignPartnerVersionTheme(partnerVersion: string): void {
    this.document.documentElement.classList.remove(
      'partner-version',
      ...Object.values(PartnerVersion).map(
        (value: string) => `partner-version-${value}`
      )
    );

    if (partnerVersion) {
      this.document.documentElement.classList.add(
        'partner-version',
        `partner-version-${partnerVersion}`
      );
    }
  }

  private updateLangAttribute(lang: string) {
    this.document.documentElement.lang = lang;
  }

  private openScanDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = 'responsive-backdrop';
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(ScanDialogComponent, dialogConfig);

    dialogRef.componentInstance.events.subscribe(({ name, ...payload }) => {
      this.applicationInsightsService.logEvent(name, payload);
      this.firebaseAnalyticsService.logEvent({
        name,
        params: payload,
      });
    });

    dialogRef.componentInstance.selectDesignation.subscribe(
      (designation: string) => {
        this.store.dispatch(selectBearing({ bearing: designation }));
      }
    );
  }
}
