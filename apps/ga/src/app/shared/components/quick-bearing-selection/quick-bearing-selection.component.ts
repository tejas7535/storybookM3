import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { from, map, of, Subject, takeUntil } from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { TranslocoService } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';
import { SearchModule } from '@schaeffler/inputs/search';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  CalculationParametersFacade,
  getBearingSelectionLoading,
  getModelCreationLoading,
  getModifiedBearingResultList,
  getSelectedBearing,
  resetBearing,
  searchBearing,
  selectBearing,
} from '@ga/core/store';
import { getPartnerVersion } from '@ga/core/store/selectors/settings/settings.selector';
import { environment } from '@ga/environments/environment';
import { AdvancedBearingButtonComponent } from '@ga/shared/components/advanced-bearing-button';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { Grease } from '@ga/shared/services/greases/greases.service';

import { GreaseSelectionAdvertComponent } from '../grease-selection-advert/grease-selection-advert.component';

@Component({
  selector: 'ga-quick-bearing-selection',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PushPipe,
    LetDirective,
    SharedTranslocoModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SearchModule,
    AdvancedBearingButtonComponent,
    RouterModule,
    MatSelectModule,
    MatIconModule,
    GreaseSelectionAdvertComponent,
  ],
  templateUrl: './quick-bearing-selection.component.html',
})
export class QuickBearingSelectionComponent implements OnInit, OnDestroy {
  @Input() resetOnInit = false;
  @Input() showSelectButton = false;
  @Input() showActionButtons = true;
  @Input() includeGreaseResult = true;

  public readonly dmcScanEnabled = environment.dmcScanEnabled;
  public readonly showDmcFeature =
    this.dmcScanEnabled && Capacitor.isNativePlatform();
  public readonly dmcSupported$ = Capacitor.isNativePlatform()
    ? from(BarcodeScanner.isSupported()).pipe(map((result) => result.supported))
    : of(false);

  public bearingSelectionLoading$ = this.store.select(
    getBearingSelectionLoading
  );
  public bearingResultList = toSignal(
    this.store.select(getModifiedBearingResultList)
  );

  public readonly greases = toSignal(
    this.calculationParametersFacade.competitorsGreases$,
    { initialValue: [] }
  );

  public filteredGreases = computed(() => {
    const greases = this.greases();
    const query = this.currentSearchQuery() || '';
    if (query.length < this.minimumChars || !this.includeGreaseResult) {
      return [];
    }

    return greases
      .filter((grease: Grease) =>
        grease.name.toLowerCase().includes(query.toLowerCase())
      )
      .map((grease: Grease) => ({
        ...grease,
        title: this.transloco.translate(
          `bearing.bearingSelection.quickSelection.selectGrease`,
          { grease: grease.name }
        ),
      }));
  });

  public resultList = computed(() => {
    const list = this.bearingResultList() || [];
    const greases = this.filteredGreases();

    return [...list, ...greases];
  });

  public searchPlaceholderKey = computed(() =>
    this.includeGreaseResult
      ? 'searchPlaceholderWithGreases'
      : 'searchPlaceholder'
  );

  public partnerVersion$ = this.store.select(getPartnerVersion);

  public selectedBearing$ = this.store.select(getSelectedBearing);
  public modelCreationLoading$ = this.store.select(getModelCreationLoading);

  private readonly minimumChars = 2;
  private readonly destroy$ = new Subject<void>();
  private currentLanguage: string;
  // eslint-disable-next-line unicorn/no-useless-undefined
  private readonly currentSearchQuery = signal<string | undefined>(undefined);

  public constructor(
    private readonly store: Store,
    public readonly transloco: TranslocoService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly trackingService: AppAnalyticsService,
    private readonly appInsightsService: ApplicationInsightsService,
    private readonly calculationParametersFacade: CalculationParametersFacade
  ) {}

  ngOnInit(): void {
    if (this.resetOnInit) {
      this.resetBearingSelection();
    }
    this.currentLanguage = this.transloco.getActiveLang();
    this.transloco.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        if (language !== this.currentLanguage) {
          this.currentLanguage = language;

          if (this.currentSearchQuery()) {
            this.store.dispatch(
              searchBearing({ query: this.currentSearchQuery() })
            );
          } else {
            this.resetBearingSelection();
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onBearingSelectionButtonClick(bearing: string | undefined): void {
    if (bearing) {
      this.store.dispatch(selectBearing({ bearing }));
    } else {
      this.resetBearingSelection();
    }
  }

  public onSearchUpdated(query: string | undefined): void {
    this.currentSearchQuery.set(query);

    if (query?.length >= this.minimumChars) {
      this.store.dispatch(searchBearing({ query }));
      this.changeDetector.detectChanges();
    } else {
      this.resetBearingSelection();
    }
  }

  public trackExpertEvent(id: string | number) {
    this.appInsightsService.logEvent('click_unsupported', {
      bearing: id,
      language: this.transloco.getActiveLang(),
    });

    this.trackingService.logRawInteractionEvent(
      'click_unsupported',
      'Selected unsuppored bearing'
    );
  }

  public onOptionSelected(option: StringOption): void {
    if (this.isGrease(option)) {
      this.calculationParametersFacade.setGreaseSearchSelection(option);

      return;
    }

    if (option && option.data && !option.data?.available) {
      const targetUrl = this.transloco.translate(
        'homepage.cards.contact.externalLink'
      );

      this.trackExpertEvent(option.id);
      window.open(targetUrl, '_blank');

      return;
    }

    if (option) {
      this.store.dispatch(selectBearing({ bearing: option.id.toString() }));
    } else {
      this.resetBearingSelection();
    }
  }

  private isGrease(obj: any): obj is Grease {
    return (
      obj &&
      typeof obj === 'object' &&
      'company' in obj &&
      'name' in obj &&
      'id' in obj &&
      'mixableGreases' in obj
    );
  }

  private resetBearingSelection(): void {
    this.store.dispatch(resetBearing());
  }
}
