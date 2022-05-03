import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { filter, startWith, Subject, takeUntil } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@ngneat/transloco';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import packageJson from '../../package.json';
import { LANGUAGE } from './shared/constants';

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

  constructor(
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly metaService: Meta,
    private readonly titleService: Title,
    private readonly oneTrustService: OneTrustService,
    private readonly applicationInsightsService: ApplicationInsightsService
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
        this.assignMetaTags();
        this.assignFooterLinks();
      });

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        this.assignMetaTags();
        this.assignFooterLinks();
        this.oneTrustService.translateBanner(language, true);

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
    this.applicationInsightsService.logEvent(LANGUAGE, {
      value: language,
    });
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
      {
        link: `${LegalRoute}/${LegalPath.CookiePath}`,
        title: this.translocoService.translate('legal.cookiePolicy'),
        external: false,
      },
    ];
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
