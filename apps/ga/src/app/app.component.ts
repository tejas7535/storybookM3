import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Meta, MetaDefinition } from '@angular/platform-browser';

import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';

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
    { name: 'title', content: translate<string>('meta.title') },
    { name: 'description', content: translate<string>('meta.description') },
    // Open Graph / Facebook
    { name: 'og:title', content: translate<string>('meta.title') },
    { name: 'og:description', content: translate<string>('meta.description') },
    // Twitter
    { name: 'twitter:title', content: translate<string>('meta.title') },
    {
      name: 'twitter:description',
      content: translate<string>('meta.description'),
    },
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
        title: translate<string>('legal.imprint'),
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
        title: translate<string>('legal.dataPrivacy'),
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.TermsPath}`,
        title: translate<string>('legal.termsOfUse'),
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.CookiePath}`,
        title: translate<string>('legal.cookiePolicy'),
        external: false,
      },
    ];
  }
}
