import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { filter, startWith, Subject, take, takeUntil } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LegalPath } from '@schaeffler/legal-pages';

import { getAppFooterLinks } from '@ga/core/helpers/app-config-helpers';
import { SettingsFacade, StorageMessagesActions } from '@ga/core/store';

import packageJson from '../../package.json';
import { TRACKING_NAME_LANGUAGE } from './shared/constants';
import { PartnerVersion } from './shared/models';
import { EmbeddedGoogleAnalyticsService } from './shared/services/embedded-google-analytics/embedded-google-analytics.service';

@Component({
  selector: 'ga-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public appTitle = 'Grease App';
  public destroy$: Subject<void> = new Subject<void>();
  public isCookiePage = false;
  public footerLinks: AppShellFooterLink[] = [];
  public currentLanguage!: string;
  appVersion = packageJson.version;
  public appIsEmbedded$ = this.settingsFacade.appIsEmbedded$;
  public partnerVersion$ = this.settingsFacade.partnerVersion$;
  public internalUser$ = this.settingsFacade.internalUser$;

  constructor(
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly metaService: Meta,
    private readonly titleService: Title,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly settingsFacade: SettingsFacade,
    private readonly embeddedGoogleAnalyticsService: EmbeddedGoogleAnalyticsService,
    private readonly store: Store,
    @Optional() private readonly oneTrustService: OneTrustService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngOnInit(): void {
    this.currentLanguage = this.translocoService.getActiveLang();
    this.assignMetaTags();
    this.assignFooterLinks();

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
        if (language !== this.currentLanguage) {
          this.currentLanguage = language;
          this.trackLanguage(language);
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
      });

    if (this.embeddedGoogleAnalyticsService.isApplicationOfEmbeddedVersion()) {
      this.router.events
        .pipe(
          takeUntil(this.destroy$),
          filter((event) => event instanceof NavigationEnd)
        )
        .subscribe((event) => {
          this.embeddedGoogleAnalyticsService.logNavigationEvent(
            (event as NavigationEnd).url
          );
        });
    }

    this.store.dispatch(StorageMessagesActions.getStorageMessage());
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
    this.footerLinks = getAppFooterLinks();
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
}
