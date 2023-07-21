import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { SettingsFacade } from './core/store';
import { ProductSelectionActions, SettingsActions } from './core/store/actions';
import { setResultPreviewSticky } from './core/store/actions/settings/settings.actions';
import { isStandalone } from './core/store/selectors/settings/settings.selector';
import { DEFAULT_BEARING_DESIGNATION } from './shared/constants/products';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'engineering-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  @Input() bearingDesignation: string | undefined;
  @Input() standalone: string | undefined;

  public title = 'Engineering App';
  public isStandalone$ = this.store.select(isStandalone);

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

  public footerLinks$: Observable<AppShellFooterLink[]> =
    this.translocoService.langChanges$.pipe(
      startWith(''),
      map(() => [
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
      ])
    );

  private readonly destroyScrollThreshold$ = new Subject<boolean>();

  constructor(
    private readonly store: Store,
    private readonly settingsFacade: SettingsFacade,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bearingDesignation) {
      this.store.dispatch(
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: changes.bearingDesignation.currentValue,
        })
      );
    }

    if (changes.standalone) {
      this.store.dispatch(
        SettingsActions.setStandalone({
          isStandalone: changes.standalone.currentValue === 'true',
        })
      );
    }
  }

  handleContentScroll($event: Event) {
    this.containerScrollEvent$.next($event);
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
  }

  ngOnDestroy() {
    this.destroyScrollThreshold$.next(true);
  }
}
