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
import { NavigationEnd, Router } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { isLanguageAvailable } from '@ea/shared/helper/language-helpers';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { SettingsFacade } from './core/store';
import {
  ProductSelectionActions,
  SettingsActions,
  StorageMessagesActions,
} from './core/store/actions';
import { setResultPreviewSticky } from './core/store/actions/settings/settings.actions';
import { isBearingSupported } from './core/store/selectors/product-selection/product-selection.selector';
import { getLocaleForLanguage } from './shared/constants/language';

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

  public isStandalone$ = this.settingsFacade.isStandalone$;
  public isBearingSupported$ = this.store.select(isBearingSupported);
  public isCookiePage = false;

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
    this.translocoService.selectTranslate('legal.cookiePolicy').pipe(
      map((title) => ({
        link: `${LegalRoute}/${LegalPath.CookiePath}`,
        title,
        external: false,
      })),
      filter(() => !Capacitor.isNativePlatform()),
      // eslint-disable-next-line unicorn/no-useless-undefined
      startWith(undefined)
    ),
  ]).pipe(
    map((links) => links.filter(Boolean)) // Filter out any null values
  );

  private readonly destroyScrollThreshold$ = new Subject<boolean>();

  constructor(
    private readonly store: Store,
    private readonly settingsFacade: SettingsFacade,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
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

    this.router.events
      .pipe(
        takeUntil(this.destroyScrollThreshold$),
        filter((event) => event instanceof NavigationEnd),
        startWith('')
      )
      .subscribe((event) => {
        const url = (event as NavigationEnd).url?.split('/').pop();
        this.isCookiePage = url === LegalPath.CookiePath;
      });

    const currentLanguage = isLanguageAvailable(this.language)
      ? this.language
      : this.translocoService.getActiveLang();

    this.translocoService.setActiveLang(currentLanguage);
    this.localeService.setLocale(getLocaleForLanguage(currentLanguage).id);
    this.store.dispatch(StorageMessagesActions.getStorageMessage());
  }

  ngOnDestroy() {
    this.destroyScrollThreshold$.next(true);
  }
}
