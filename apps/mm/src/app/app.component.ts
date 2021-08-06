import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';

import { FooterLink } from '@schaeffler/footer-tailwind';

import { RoutePath } from './app-routing.module';
import { LegalPath } from './legal/legal-route-path.enum';

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

  public footerLinks: FooterLink[] = [
    {
      link: `${RoutePath.LegalPath}/${LegalPath.ImprintPath}`,
      title: translate('legal.imprint'),
      external: false,
    },
    {
      link: `${RoutePath.LegalPath}/${LegalPath.DataprivacyPath}`,
      title: translate('legal.dataPrivacy'),
      external: false,
    },
    {
      link: `${RoutePath.LegalPath}/${LegalPath.TermsPath}`,
      title: translate('legal.termsOfUse'),
      external: false,
    },
    {
      link: `${RoutePath.LegalPath}/${LegalPath.CookiePath}`,
      title: translate('legal.cookiePolicy'),
      external: false,
    },
  ];

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
    private readonly meta: Meta
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
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public checkIframe(): void {
    if (window.self !== window.top) {
      this.embedded = true;
    }
  }
}
