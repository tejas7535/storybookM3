import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, filter, startWith, Subject, takeUntil } from 'rxjs';

import {
  LoadedEvent,
  translate,
  TranslocoEvents,
  TranslocoService,
} from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { availableLanguages } from './core/core.module';
import { setLanguage } from './core/store/actions/settings/settings.actions';
import { LANGUAGE } from './shared/constants';

@Component({
  selector: 'ga-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Grease App';
  metaTags: MetaDefinition[] = [
    { name: 'title', content: translate('meta.title') },
    { name: 'description', content: translate('meta.description') },
    // Open Graph / Facebook
    { name: 'og:title', content: translate('meta.title') },
    { name: 'og:description', content: translate('meta.description') },
    // Twitter
    { name: 'twitter:title', content: translate('meta.title') },
    {
      name: 'twitter:description',
      content: translate('meta.description'),
    },
  ];

  public footerLinks$: BehaviorSubject<AppShellFooterLink[]> =
    new BehaviorSubject(this.updateFooterLinks());
  public destroy$: Subject<void> = new Subject<void>();
  public isCookiePage = false;
  public cookieSettings = translate('legal.cookieSettings');
  public availableLanguages = availableLanguages;
  public languageControl = new FormControl();

  constructor(
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly store: Store,
    private readonly meta: Meta,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {
    this.meta.addTags(this.metaTags);
  }

  public ngOnInit(): void {
    this.translocoService.events$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (event: TranslocoEvents) =>
            !(event as LoadedEvent).wasFailure &&
            event.type === 'translationLoadSuccess'
        )
      )
      .subscribe(() => {
        this.footerLinks$.next(this.updateFooterLinks());
      });
    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.footerLinks$.next(this.updateFooterLinks()));
    this.languageControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((language: string) => {
        this.store.dispatch(setLanguage({ language }));
        this.trackLanguage(language);
      });
    this.languageControl.setValue(this.translocoService.getActiveLang());

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

  public trackLanguage(language: string): void {
    this.applicationInsightsService.logEvent(LANGUAGE, {
      value: language,
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFooterLinks(): AppShellFooterLink[] {
    return [
      {
        link: `${LegalRoute}/${LegalPath.ImprintPath}`,
        title: translate('legal.imprint'),
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
        title: translate('legal.dataPrivacy'),
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.TermsPath}`,
        title: translate('legal.termsOfUse'),
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.CookiePath}`,
        title: translate('legal.cookiePolicy'),
        external: false,
      },
    ];
  }
}
