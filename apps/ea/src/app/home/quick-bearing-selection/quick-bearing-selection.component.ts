import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { map, Observable, Subject } from 'rxjs';

import { ProductSelectionFacade } from '@ea/core/store';
import { ProductSelectionActions } from '@ea/core/store/actions';
import { LetDirective, PushPipe } from '@ngrx/component';

import { StringOption } from '@schaeffler/inputs';
import { SearchModule } from '@schaeffler/inputs/search';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-quick-bearing-selection',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PushPipe,
    LetDirective,
    SharedTranslocoModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SearchModule,
    MatIconModule,
    MatChipsModule,
  ],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,
      useValue: { overlayPanelClass: 'searchOverlay' },
    },
  ],
  templateUrl: './quick-bearing-selection.component.html',
})
export class QuickBearingSelectionComponent implements OnInit, OnDestroy {
  @Input() showSelectButton = false;

  public bearingSelectionLoading$ =
    this.productSelectionFacade.isBearingSelectionLoading$;

  public bearingResultList$: Observable<StringOption[]> =
    this.productSelectionFacade.bearingDesignationResultList$.pipe(
      map((bearingDesignation) => {
        if (!bearingDesignation) {
          // eslint-disable-next-line unicorn/no-useless-undefined
          return undefined;
        }
        const options: StringOption[] = bearingDesignation.map((result) => ({
          id: result.bearinxId,
          title: result.designation,
        }));

        return options;
      })
    );

  public selectedBearing$ = this.productSelectionFacade.bearingDesignation$;

  private readonly minimumChars = 2;
  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly productSelectionFacade: ProductSelectionFacade
  ) {}

  ngOnInit(): void {
    this.resetBearingSelection();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSearchUpdated(query: string | undefined): void {
    if (query?.length >= this.minimumChars) {
      this.productSelectionFacade.dispatch(
        ProductSelectionActions.searchBearing({ query })
      );
      this.changeDetector.detectChanges();
    } else {
      this.resetBearingSelection();
    }
  }

  public onOptionSelected(option: StringOption): void {
    if (option) {
      this.productSelectionFacade.dispatch(
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: option.id.toString(),
          shouldNavigateToCalculationPage: true,
        })
      );
    } else {
      this.resetBearingSelection();
    }
  }

  private resetBearingSelection(): void {
    this.productSelectionFacade.dispatch(
      ProductSelectionActions.resetBearing()
    );
  }
}
