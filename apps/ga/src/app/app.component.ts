import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { filter, startWith, Subject, takeUntil } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@ngneat/transloco';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { SettingsFacade } from '@ga/core/store';

import packageJson from '../../package.json';
import { TRACKING_NAME_LANGUAGE } from './shared/constants';

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

  constructor(
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly metaService: Meta,
    private readonly titleService: Title,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly settingsFacade: SettingsFacade,
    @Optional() private readonly oneTrustService: OneTrustService
  ) {}

  public ngOnInit(): void {
    this.currentLanguage = this.translocoService.getActiveLang();
    this.assignMetaTags();
    this.assignFooterLinks();

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
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.footerLinks = [
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
    ];

    if (
      !window.origin.includes('capacitor://') &&
      window.origin !== 'http://localhost'
    ) {
      const cookieLink = {
        link: `${LegalRoute}/${LegalPath.CookiePath}`,
        title: this.translocoService.translate('legal.cookiePolicy'),
        external: false,
      };

      this.footerLinks.push(cookieLink);
    }
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
}
