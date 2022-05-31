import { Component, EventEmitter, Output } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  getBearingExtendedSearchResultsCount,
  getBearingLoading,
} from '@ga/core/store';

import { tooManyBearingsResultsThreshold } from '../../constants';
import { isValidBearingSelection } from '../../helpers';

@Component({
  selector: 'ga-bearing-selection-button',
  templateUrl: './bearing-selection-button.component.html',
})
export class BearingSelectionButtonComponent {
  @Output() buttonClick = new EventEmitter();

  public resultsLimit = tooManyBearingsResultsThreshold;

  public bearingLoading$ = this.store.select(getBearingLoading);

  public bearingExtendedSearchResultsCount$ = this.store.select(
    getBearingExtendedSearchResultsCount
  );

  constructor(private readonly store: Store) {}

  public onButtonClick(): void {
    this.buttonClick.emit();
  }

  public isValidSelection(resultsCount: number) {
    return isValidBearingSelection(resultsCount);
  }
}
