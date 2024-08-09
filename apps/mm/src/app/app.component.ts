/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, filter, startWith, Subject, takeUntil } from 'rxjs';

import {
  LoadedEvent,
  translate,
  TranslocoEvents,
  TranslocoService,
} from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import packageJson from '../../package.json';
import { RoutePath } from './app-routing.module';
import { detectAppDelivery } from './core/helpers/settings-helpers';
import { OneTrustMobileService } from './core/services/tracking/one-trust-mobile.service';
import { StorageMessagesActions } from './core/store/actions';
import { AppDelivery } from './shared/models';

@Component({
  selector: 'mm-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Mounting Manager';
  public embedded = detectAppDelivery() === AppDelivery.Embedded;
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
    private readonly translocoService: TranslocoService,
    private readonly store: Store,
    private readonly oneTrustMobileService: OneTrustMobileService
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
        const url = (event as NavigationEnd).url;
        this.isCookiePage = url?.split('/').pop() === LegalPath.CookiePath;
        const parsedUrl = window.location;
        if (url && parsedUrl.pathname === '/') {
          this.router.navigate([RoutePath.HomePath], {
            queryParamsHandling: 'preserve',
          });
        }
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

    this.store.dispatch(StorageMessagesActions.getStorageMessage());
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public checkIframe(): void {
    if (detectAppDelivery() === AppDelivery.Embedded) {
      this.embedded = true;
    }
  }

  private updateFooterLinks(): AppShellFooterLink[] {
    const appDelivery = detectAppDelivery();
    const footerLinks: AppShellFooterLink[] = [
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

    if (appDelivery === AppDelivery.Standalone) {
      const cookieLink = {
        link: `${LegalRoute}/${LegalPath.CookiePath}`,
        title: this.translocoService.translate('legal.cookiePolicy'),
        external: false,
      };

      footerLinks.push(cookieLink);
    }

    if (appDelivery === AppDelivery.Native) {
      footerLinks.push({
        link: undefined,
        title: translate('legal.cookiePolicy'),
        external: false,
        onClick: ($event: MouseEvent) => {
          $event.preventDefault();
          this.oneTrustMobileService.showPreferenceCenterUI();
        },
      });
    }

    return footerLinks;
  }
}
