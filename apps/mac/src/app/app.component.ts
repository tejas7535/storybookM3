import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { OneTrustService } from '@altack/ngx-onetrust';
import {
  LoadedEvent,
  translate,
  TranslocoEvents,
  TranslocoService,
} from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { getProfileImage, getUsername } from '@schaeffler/azure-auth';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { RoutePath } from '@mac/app-routing.enum';

@Component({
  selector: 'mac-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Materials App Center';

  public isCookiePage = false;
  public cookieSettings = translate('legal.cookieSettings');
  public destroy$ = new Subject<void>();

  public username$: Observable<string>;
  public profileImage$: Observable<string>;

  public footerLinks$ = new BehaviorSubject<AppShellFooterLink[]>(
    this.updateFooterLinks()
  );

  url: string;

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly applicationInsightService: ApplicationInsightsService,
    private readonly translocoService: TranslocoService,
    private readonly oneTrustService: OneTrustService
  ) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        const url = (event as NavigationEnd).url?.split('/').pop();

        this.isCookiePage = url === LegalPath.CookiePath;

        this.applicationInsightService.logEvent('[MAC - NAVIGATION]', {
          url: (event as NavigationEnd).url,
          urlAfterRedirects: (event as NavigationEnd).urlAfterRedirects,
        });
        this.url = (event as NavigationEnd).url;
      });

    this.translocoService.events$
      .pipe(
        filter(
          (event: TranslocoEvents) =>
            !(event as LoadedEvent).wasFailure &&
            event.type === 'translationLoadSuccess'
        )
      )
      .subscribe(() => {
        this.oneTrustService.translateBanner(
          this.translocoService.getActiveLang(),
          true
        );
        this.footerLinks$.next(this.updateFooterLinks());
      });

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language: string) => {
        this.oneTrustService.translateBanner(language, true);
        this.footerLinks$.next(this.updateFooterLinks());
      });
  }

  public get link(): string | boolean {
    return this.url && this.url !== `/${RoutePath.OverviewPath}`
      ? `/${RoutePath.OverviewPath}`
      : false;
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
      {
        link: `${LegalRoute}/${LegalPath.CookiePath}`,
        title: this.translocoService.translate('legal.cookiePolicy'),
        external: false,
      },
    ];

    return footerLinks;
  }
}
