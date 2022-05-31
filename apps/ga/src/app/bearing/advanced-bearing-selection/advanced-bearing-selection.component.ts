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
  public boreDiameterRangeFilter: RangeFilter;
  public outsideDiameterRangeFilter: RangeFilter;
  public widthRangeFilter: RangeFilter;

  public step = 0;
  public extendedSearchParameters: ExtendedSearchParameters;

  public bearingExtendedSearchResultsCount$ = this.store.select(
    getBearingExtendedSearchResultsCount
  );

  private readonly bearingExtendedSearchParameters$ = this.store.select(
    getBearingExtendedSearchParameters
  );

  ngOnInit(): void {
    this.setBoreDiameterRangeFilter();
    this.setOutsideDiameterRangeFilter();
    this.setWidthRangeFilter();

    this.bearingExtendedSearchParameters$.subscribe(
      (extendedSearchParameters) => {
        this.extendedSearchParameters = { ...extendedSearchParameters };
        this.setBoreDiameterRangeFilter(extendedSearchParameters);
        this.setOutsideDiameterRangeFilter(extendedSearchParameters);
        this.setWidthRangeFilter(extendedSearchParameters);
      }
    );
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

  public setStep(index: number): void {
    this.step = index;
  }

  public onBearingSelectionButtonClick(): void {
    const parameters = this.getQueryParams();

    this.store.dispatch(searchBearingExtended({ parameters }));
    // eslint-disable-next-line no-plusplus
    this.step++;
  }

  public prevStep(): void {
    // eslint-disable-next-line no-plusplus
    this.step--;
  }

  public isValidSelection(resultsCount: number) {
    return isValidBearingSelection(resultsCount);
  }

  private fetchResultsCount(): void {
    const parameters = this.getQueryParams();

    this.store.dispatch(searchBearingExtendedCount({ parameters }));
  }

  private setBoreDiameterRangeFilter(
    extendedSearchParameters?: ExtendedSearchParameters
  ): void {
    this.boreDiameterRangeFilter =
      this.selectionService.getBoreDiameterRangeFilter(
        extendedSearchParameters
      );
  }

  private setOutsideDiameterRangeFilter(
    extendedSearchParameters?: ExtendedSearchParameters
  ): void {
    this.outsideDiameterRangeFilter =
      this.selectionService.getOutsideDiameterRangeFilter(
        extendedSearchParameters
      );
  }

  private setWidthRangeFilter(
    extendedSearchParameters?: ExtendedSearchParameters
  ): void {
    this.widthRangeFilter = this.selectionService.getWidthRangeFilter(
      extendedSearchParameters
    );
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
