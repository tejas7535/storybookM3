import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  getAdvancedBearingSelectionFilters,
  searchBearingForAdvancedSelection,
  searchBearingForAdvancedSelectionCount,
} from '@ga/core/store';
import { RangeFilter } from '@ga/shared/components/range-filter';
import { AdvancedBearingSelectionFilters } from '@ga/shared/models';

import { tooManyBearingsResultsThreshold } from './constants';
import { AdvancedBearingSelectionService } from './services/advanced-bearing-selection.service';

@Component({
  selector: 'ga-advanced-bearing-selection',
  templateUrl: './advanced-bearing-selection.component.html',
  styleUrls: ['./advanced-bearing-selection.component.scss'],
})
export class AdvancedBearingSelectionComponent implements OnInit {
  public step = 0;
  public resultsThreshold = tooManyBearingsResultsThreshold;
  public bearingTypes = this.selectionService.bearingTypes;
  public boreDiameterRangeFilter: RangeFilter;
  public outsideDiameterRangeFilter: RangeFilter;
  public widthRangeFilter: RangeFilter;
  public advancedBearingSelectionFilters: AdvancedBearingSelectionFilters;

  private readonly advancedBearingSelectionFilters$ = this.store.select(
    getAdvancedBearingSelectionFilters
  );

  constructor(
    private readonly store: Store,
    private readonly selectionService: AdvancedBearingSelectionService
  ) {}

  ngOnInit(): void {
    this.setBoreDiameterRangeFilter();
    this.setOutsideDiameterRangeFilter();
    this.setWidthRangeFilter();

    this.advancedBearingSelectionFilters$.subscribe(
      (advancedBearingSelectionFilters) => {
        this.advancedBearingSelectionFilters = {
          ...advancedBearingSelectionFilters,
        };
        this.setBoreDiameterRangeFilter(advancedBearingSelectionFilters);
        this.setOutsideDiameterRangeFilter(advancedBearingSelectionFilters);
        this.setWidthRangeFilter(advancedBearingSelectionFilters);
      }
    );
  }

  public onBearingTypeSelectionChange(): void {
    this.fetchResultsCount();
  }

  public onBoreDiameterChange(filter: RangeFilter): void {
    this.boreDiameterRangeFilter = filter;
    this.advancedBearingSelectionFilters.boreDiameterMin = filter.minSelected;
    this.advancedBearingSelectionFilters.boreDiameterMax = filter.maxSelected;
    this.fetchResultsCount();
  }

  public onOutsideDiameterChange(filter: RangeFilter): void {
    this.outsideDiameterRangeFilter = filter;
    this.advancedBearingSelectionFilters.outsideDiameterMin =
      filter.minSelected;
    this.advancedBearingSelectionFilters.outsideDiameterMax =
      filter.maxSelected;
    this.fetchResultsCount();
  }

  public onWidthChange(filter: RangeFilter): void {
    this.widthRangeFilter = filter;
    this.advancedBearingSelectionFilters.widthMin = filter.minSelected;
    this.advancedBearingSelectionFilters.widthMax = filter.maxSelected;
    this.fetchResultsCount();
  }

  public onBearingSelectionButtonClick(): void {
    const selectionFilters = this.getSelectionFilters();

    this.store.dispatch(
      searchBearingForAdvancedSelection({ selectionFilters })
    );
    this.step += 1;
  }

  public prevStep(): void {
    this.step -= 1;
  }

  private fetchResultsCount(): void {
    const selectionFilters = this.getSelectionFilters();

    this.store.dispatch(
      searchBearingForAdvancedSelectionCount({ selectionFilters })
    );
  }

  private setBoreDiameterRangeFilter(
    selectionFilters?: AdvancedBearingSelectionFilters
  ): void {
    this.boreDiameterRangeFilter =
      this.selectionService.getBoreDiameterRangeFilter(selectionFilters);
  }

  private setOutsideDiameterRangeFilter(
    selectionFilters?: AdvancedBearingSelectionFilters
  ): void {
    this.outsideDiameterRangeFilter =
      this.selectionService.getOutsideDiameterRangeFilter(selectionFilters);
  }

  private setWidthRangeFilter(
    selectionFilters?: AdvancedBearingSelectionFilters
  ): void {
    this.widthRangeFilter =
      this.selectionService.getWidthRangeFilter(selectionFilters);
  }

  private getSelectionFilters(): AdvancedBearingSelectionFilters {
    return this.advancedBearingSelectionFilters;
  }
}
