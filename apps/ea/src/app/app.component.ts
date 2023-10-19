import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import { environment } from '@ea/environments/environment';
import { isLanguageAvailable } from '@ea/shared/helper/language-helpers';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { SettingsFacade } from './core/store';
import {
  ProductSelectionActions,
  SettingsActions,
  StorageMessagesActions,
} from './core/store/actions';
import { setResultPreviewSticky } from './core/store/actions/settings/settings.actions';
import {
  getBearingId,
  isBearingSupported,
} from './core/store/selectors/product-selection/product-selection.selector';
import { isStandalone } from './core/store/selectors/settings/settings.selector';
import {
  FALLBACK_LANGUAGE,
  getLocaleForLanguage,
} from './shared/constants/language';
import { DEFAULT_BEARING_DESIGNATION } from './shared/constants/products';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'engineering-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewInit
{
  @Input() bearingDesignation: string | undefined;
  @Input() standalone: string | undefined;
  @Input() language: string | undefined;

  public title = 'Engineering App';
  public isStandalone$ = this.store.select(isStandalone);
  public isBearingSupported$ = this.store.select(isBearingSupported);

  public isProduction = environment.production;

  public legacyAppUrl$: Observable<SafeResourceUrl> = combineLatest([
    this.translocoService.langChanges$,
    this.store.select(getBearingId),
  ]).pipe(
    map(([language, bearingId]) =>
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `${environment.oldUIFallbackUrl}${bearingId}/${language}/comma/metric/true`
      )
    )
  );

  public containerScrollEvent$ = new BehaviorSubject<Event>({} as Event);

  public hasReachedScrollingThreshold$ = this.containerScrollEvent$.pipe(
    filter(
      (event) => event !== ({} as Event) && event.target instanceof HTMLElement
    ),
    map((event) => {
      const target: Partial<HTMLElement> = event.target;
      const scrollHeight = target.scrollHeight - target.offsetHeight;
      const footer = target.parentElement?.querySelector('footer');
      const offset = footer?.clientHeight ?? 0;

      return target.scrollTop >= scrollHeight - offset;
    })
  );

  public footerLinks$: Observable<AppShellFooterLink[]> = combineLatest([
    this.translocoService.selectTranslate('legal.imprint').pipe(
      map((title) => ({
        link: `${LegalRoute}/${LegalPath.ImprintPath}`,
        title,
        external: false,
      }))
    ),
    this.translocoService.selectTranslate('legal.dataPrivacy').pipe(
      map((title) => ({
        link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
        title,
        external: false,
      }))
    ),
    this.translocoService.selectTranslate('legal.termsOfUse').pipe(
      map((title) => ({
        link: `${LegalRoute}/${LegalPath.TermsPath}`,
        title,
        external: false,
      }))
    ),
  ]);

  private readonly destroyScrollThreshold$ = new Subject<boolean>();

  constructor(
    private readonly store: Store,
    private readonly settingsFacade: SettingsFacade,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly elementRef: ElementRef,
    private readonly localeService: TranslocoLocaleService
  ) {}

  ngAfterViewInit(): void {
    const fakeScrollEvent = { target: this.elementRef.nativeElement } as Event;
    this.containerScrollEvent$.next(fakeScrollEvent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bearingDesignation) {
      this.store.dispatch(
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: changes.bearingDesignation.currentValue,
        })
      );
    }

    if (changes.standalone) {
      const isStandaloneVersion = changes.standalone.currentValue === 'true';

      if (!isStandaloneVersion) {
        this.localeService.setLocale(getLocaleForLanguage(this.language).id);
      }

      this.store.dispatch(
        SettingsActions.setStandalone({
          isStandalone: isStandaloneVersion,
        })
      );

      // trigger initial navigation (necessary for webcomponent)
      // only used if run with app shell / standalone
      // @see https://github.com/angular/angular/issues/23740
      if (isStandaloneVersion && !this.router.lastSuccessfulNavigation) {
        this.router.initialNavigation();
      }
    }
  }

  ngOnInit(): void {
    this.hasReachedScrollingThreshold$
      .pipe(takeUntil(this.destroyScrollThreshold$))
      .subscribe((thresholdMet) => {
        this.settingsFacade.dispatch(
          setResultPreviewSticky({ isResultPreviewSticky: !thresholdMet })
        );
      });

    if (!this.bearingDesignation) {
      // trigger calculations with default bearing
      this.store.dispatch(
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: DEFAULT_BEARING_DESIGNATION,
        })
      );
    }

    const currentLanguage = isLanguageAvailable(this.language)
      ? this.language
      : FALLBACK_LANGUAGE.id;

    this.translocoService.setActiveLang(currentLanguage);
    this.store.dispatch(StorageMessagesActions.getStorageMessage());
  }

  ngOnDestroy() {
    this.destroyScrollThreshold$.next(true);
  }
}
