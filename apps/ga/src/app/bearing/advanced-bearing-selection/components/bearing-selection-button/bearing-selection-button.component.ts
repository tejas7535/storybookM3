import { Component, EventEmitter, Output } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  getAdvancedBearingSelectionResultsCount,
  getBearingSelectionLoading,
} from '@ga/core/store';

import { tooManyBearingsResultsThreshold } from '../../constants';

@Component({
  selector: 'ga-bearing-selection-button',
  templateUrl: './bearing-selection-button.component.html',
})
export class BearingSelectionButtonComponent {
  @Output() buttonClick = new EventEmitter();

  public resultsThreshold = tooManyBearingsResultsThreshold;

  public bearingSelectionLoading$ = this.store.select(
    getBearingSelectionLoading
  );

  public advancedBearingSelectionResultsCount$ = this.store.select(
    getAdvancedBearingSelectionResultsCount
  );

  constructor(private readonly store: Store) {}

  public onButtonClick(): void {
    this.buttonClick.emit();
  }

  public isValidSelection(resultsCount: number): boolean {
    return resultsCount > 0 && resultsCount <= tooManyBearingsResultsThreshold;
  }
}
