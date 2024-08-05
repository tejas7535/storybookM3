import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';
import { SearchModule } from '@schaeffler/inputs/search';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
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

@Component({
  selector: 'ga-quick-bearing-selection',
  standalone: true,
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
  ],
  templateUrl: './quick-bearing-selection.component.html',
})
export class QuickBearingSelectionComponent implements OnInit, OnDestroy {
  @Input() resetOnInit = false;
  @Input() showSelectButton = false;

  public readonly dmcScanEnabled = environment.dmcScanEnabled;

  public bearingSelectionLoading$ = this.store.select(
    getBearingSelectionLoading
  );
  public bearingResultList$ = this.store.select(getModifiedBearingResultList);
  public partnerVersion$ = this.store.select(getPartnerVersion);

  public selectedBearing$ = this.store.select(getSelectedBearing);
  public modelCreationLoading$ = this.store.select(getModelCreationLoading);

  private readonly minimumChars = 2;
  private readonly destroy$ = new Subject<void>();
  private currentLanguage: string;
  private currentSearchQuery: string;

  public constructor(
    private readonly store: Store,
    public readonly transloco: TranslocoService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly trackingService: AppAnalyticsService,
    private readonly appInsightsService: ApplicationInsightsService
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

          if (this.currentSearchQuery) {
            this.store.dispatch(
              searchBearing({ query: this.currentSearchQuery })
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
    this.currentSearchQuery = query;

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

  private resetBearingSelection(): void {
    this.store.dispatch(resetBearing());
  }
}
