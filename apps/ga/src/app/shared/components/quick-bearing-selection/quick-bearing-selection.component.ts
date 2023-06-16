import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';
import { SearchModule } from '@schaeffler/inputs/search';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  getBearingSelectionLoading,
  getModelCreationLoading,
  getQuickBearingSelectionResultList,
  getSelectedBearing,
  resetBearing,
  searchBearing,
  selectBearing,
} from '@ga/core/store';
import { AdvancedBearingButtonComponent } from '@ga/shared/components/advanced-bearing-button';

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
  ],
  templateUrl: './quick-bearing-selection.component.html',
})
export class QuickBearingSelectionComponent implements OnInit, OnDestroy {
  @Input() resetOnInit = false;
  @Input() showSelectButton = false;

  public bearingSelectionLoading$ = this.store.select(
    getBearingSelectionLoading
  );
  public bearingResultList$ = this.store.select(
    getQuickBearingSelectionResultList
  );
  public selectedBearing$ = this.store.select(getSelectedBearing);
  public modelCreationLoading$ = this.store.select(getModelCreationLoading);

  private readonly minimumChars = 2;
  private readonly destroy$ = new Subject<void>();
  private currentLanguage: string;
  private currentSearchQuery: string;

  public constructor(
    private readonly store: Store,
    private readonly transloco: TranslocoService,
    private readonly changeDetector: ChangeDetectorRef
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

  public onOptionSelected(option: StringOption): void {
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
