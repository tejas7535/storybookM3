import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { AppShellFooterLink } from '@schaeffler/app-shell';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import {
  BehaviorSubject,
  Subject,
  combineLatestWith,
  debounceTime,
  filter,
  map,
  takeUntil,
} from 'rxjs';
import { SettingsFacade } from './core/store';
import { ProductSelectionActions, SettingsActions } from './core/store/actions';
import { setResultPreviewSticky } from './core/store/actions/settings/settings.actions';
import { isStandalone } from './core/store/selectors/settings/settings.selector';
import { DEFAULT_BEARING_DESIGNATION } from './shared/constants/products';

const APP_BOTTOM_SCROLL_FIXED_OFFSET = 305;
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'engineering-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnChanges {
  @Input() bearingDesignation: string | undefined;
  @Input() standalone: string | undefined;

  public title = 'Engineering App';
  public isStandalone$ = this.store.select(isStandalone);

  public containerScrollEvent$ = new BehaviorSubject<Event>({} as Event);

  public hasReachedScrollingThreshold$ = this.containerScrollEvent$.pipe(
    filter(
      (event) => event !== ({} as Event) && event.target instanceof HTMLElement
    ),
    debounceTime(50),
    combineLatestWith(this.settingsFacade.isResultPreviewSticky$),
    map(([event, isStickyState]) => {
      const target: Partial<HTMLElement> = event.target;
      const scrollHeight = target.scrollHeight - target.offsetHeight;

      if (isStickyState) {
        return target.scrollTop >= scrollHeight;
      }
      return target.scrollTop >= scrollHeight - APP_BOTTOM_SCROLL_FIXED_OFFSET;
    })
  );

  private readonly destroyScrollThreshold$ = new Subject<boolean>();

  public footerLinks: AppShellFooterLink[] = [
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
  ];

  public constructor(
    private readonly store: Store,
    private readonly settingsFacade: SettingsFacade
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
