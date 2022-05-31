import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  getBearingExtendedSearchParameters,
  getBearingExtendedSearchResultsCount,
  searchBearingExtended,
  searchBearingExtendedCount,
} from '@ga/core/store';
import { RangeFilter } from '@ga/shared/components/range-filter';
import { ExtendedSearchParameters } from '@ga/shared/models';

import { tooManyBearingsResultsThreshold } from './constants';
import { isValidBearingSelection } from './helpers';
import { AdvancedBearingSelectionService } from './services/advanced-bearing-selection.service';

@Component({
  selector: 'ga-advanced-bearing-selection',
  templateUrl: './advanced-bearing-selection.component.html',
  styleUrls: ['./advanced-bearing-selection.component.scss'],
})
export class AdvancedBearingSelectionComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly selectionService: AdvancedBearingSelectionService
  ) {}

  public resultsLimit = tooManyBearingsResultsThreshold;

  public bearingTypes = this.selectionService.bearingTypes;
  public boreDiameterRangeFilter =
    this.selectionService.boreDiameterRangeFilter;
  public outsideDiameterRangeFilter =
    this.selectionService.outsideDiameterRangeFilter;
  public widthRangeFilter = this.selectionService.widthRangeFilter;

  public step = 0;
  public extendedSearchParameters: ExtendedSearchParameters;

  public bearingExtendedSearchResultsCount$ = this.store.select(
    getBearingExtendedSearchResultsCount
  );

  private readonly bearingExtendedSearchParameters$ = this.store.select(
    getBearingExtendedSearchParameters
  );

  ngOnInit(): void {
    this.handleSubscriptions();
  }

  public onBearingTypeSelectionChange(): void {
    this.fetchResultsCount();
  }

  public onBoreDiameterChange(filter: RangeFilter): void {
    this.boreDiameterRangeFilter = filter;
    this.extendedSearchParameters.boreDiameterMin = filter.minSelected;
    this.extendedSearchParameters.boreDiameterMax = filter.maxSelected;
    this.fetchResultsCount();
  }

  public onOutsideDiameterChange(filter: RangeFilter): void {
    this.outsideDiameterRangeFilter = filter;
    this.extendedSearchParameters.outsideDiameterMin = filter.minSelected;
    this.extendedSearchParameters.outsideDiameterMax = filter.maxSelected;
    this.fetchResultsCount();
  }

  public onWidthChange(filter: RangeFilter): void {
    this.widthRangeFilter = filter;
    this.extendedSearchParameters.widthMin = filter.minSelected;
    this.extendedSearchParameters.widthMax = filter.maxSelected;
    this.fetchResultsCount();
  }

  setStep(index: number) {
    this.step = index;
  }

  onBearingSelectionButtonClick() {
    const parameters = this.getQueryParams();

    if (this.formIsValid()) {
      this.store.dispatch(searchBearingExtended({ parameters }));
    }
    // eslint-disable-next-line no-plusplus
    this.step++;
  }

  prevStep() {
    // eslint-disable-next-line no-plusplus
    this.step--;
  }

  handleSubscriptions(): void {
    this.bearingExtendedSearchParameters$.subscribe(
      (extendedSearchParameters) => {
        this.extendedSearchParameters = { ...extendedSearchParameters };
      }
    );
  }

  // innerOuterValidator(): ValidatorFn {
  //   return (): { [key: string]: boolean } | null => {
  //     if (
  //       (this.minDi?.value > 0 || this.maxDi?.value > 0) &&
  //       (this.minDa?.value > 0 || this.maxDa?.value > 0) &&
  //       Math.max(this.minDi?.value, this.maxDi?.value) >
  //         Math.min(
  //           ...[this.minDa?.value, this.maxDa?.value].filter(
  //             (entry) => entry > 0
  //           )
  //         )
  //     ) {
  //       return {
  //         innerOuterInconsistent: true,
  //       };
  //     }
  //
  //     return undefined;
  //   };
  // }

  public isValidSelection(resultsCount: number) {
    return isValidBearingSelection(resultsCount);
  }

  formIsValid(): boolean {
    return true;
  }

  private fetchResultsCount() {
    const parameters = this.getQueryParams();

    if (this.formIsValid()) {
      this.store.dispatch(searchBearingExtendedCount({ parameters }));
    }
  }

  private getQueryParams(): ExtendedSearchParameters {
    return {
      ...this.extendedSearchParameters,
      boreDiameterMax:
        this.extendedSearchParameters.boreDiameterMax ||
        this.selectionService.dimensionMaxValue,
      outsideDiameterMax:
        this.extendedSearchParameters.outsideDiameterMax ||
        this.selectionService.dimensionMaxValue,
      widthMax:
        this.extendedSearchParameters.widthMax ||
        this.selectionService.dimensionMaxValue,
    };
  }
}
