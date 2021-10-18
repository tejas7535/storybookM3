import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Meta, MetaDefinition } from '@angular/platform-browser';

import { BehaviorSubject, filter, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  LoadedEvent,
  translate,
  TranslocoEvents,
  TranslocoService,
} from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { FooterLink } from '@schaeffler/footer';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { availableLanguages } from './core/core.module';
import { setLanguage } from './core/store/actions/settings/settings.actions';

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
    { name: 'twitter:description', content: translate('meta.description') },
  ];

  public footerLinks$: BehaviorSubject<FooterLink[]> = new BehaviorSubject(
    this.updateFooterLinks()
  );
  public destroy$: Subject<void> = new Subject<void>();

  public availableLanguages = availableLanguages;
  public languageControl = new FormControl();

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly store: Store,
    private readonly meta: Meta
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
      .subscribe((language: string) =>
        this.store.dispatch(setLanguage({ language }))
      );
    this.languageControl.setValue(this.translocoService.getActiveLang());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFooterLinks(): FooterLink[] {
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
