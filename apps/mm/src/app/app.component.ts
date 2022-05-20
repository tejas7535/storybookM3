import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, filter, startWith, Subject, takeUntil } from 'rxjs';

import {
  LoadedEvent,
  translate,
  TranslocoEvents,
  TranslocoService,
} from '@ngneat/transloco';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import packageJson from '../../package.json';

@Component({
  selector: 'mm-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Mounting Manager';
  public embedded = false;
  public isCookiePage = false;
  public cookieSettings = translate('legal.cookieSettings');
  public destroy$ = new Subject<void>();
  public appVersion = packageJson.version;

  public footerLinks$ = new BehaviorSubject<AppShellFooterLink[]>(
    this.updateFooterLinks()
  );

  metaTags: MetaDefinition[] = [
    { name: 'title', content: translate('meta.title') },
    { name: 'description', content: translate('meta.description') },
    // Open Graph / Facebook
    { name: 'og:title', content: translate('meta.title') },
    { name: 'og:description', content: translate('meta.description') },
    // Twitter
    { name: 'twitter:title', content: translate('meta.title') },
    { name: 'twitter:description', content: translate('meta.description') },
  ];

  public constructor(
    private readonly router: Router,
    private readonly meta: Meta,
    private readonly translocoService: TranslocoService
  ) {
    this.meta.addTags(this.metaTags);
  }

  public ngOnInit(): void {
    this.checkIframe();

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

    this.translocoService.events$
      .pipe(
        filter(
          (event: TranslocoEvents) =>
            !(event as LoadedEvent).wasFailure &&
            event.type === 'translationLoadSuccess'
        )
      )
      .subscribe(() => this.footerLinks$.next(this.updateFooterLinks()));

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.footerLinks$.next(this.updateFooterLinks()));
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFooterLinks(): AppShellFooterLink[] {
    const footerLinks = [
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

      footerLinks.push(cookieLink);
    }

    return footerLinks;
  }

  public checkIframe(): void {
    if (window.self !== window.top) {
      this.embedded = true;
    }
  }
}
