import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { CalculationOptionsActions } from '../actions';
import { CalculationResultSelector } from '../selectors';

@Injectable({
  providedIn: 'root',
})
export class CalculationResultFacade {
  public readonly getCalculationInputs$ = this.store.select(
    CalculationResultSelector.getCalculationInputs
  );

  public readonly getCalulationMessages$ = this.store.select(
    CalculationResultSelector.getCalculationMessages
  );

  public readonly isResultAvailable$ = this.store.select(
    CalculationResultSelector.isResultAvailable
  );

  public readonly isLoading$ = this.store.select(
    CalculationResultSelector.isLoading
  );

  public readonly mountingRecommendations$ = this.store.select(
    CalculationResultSelector.getMountingRecommendations
  );

  public readonly mountingTools$ = this.store.select(
    CalculationResultSelector.getMountingTools
  );

  public readonly startPositions$ = this.store.select(
    CalculationResultSelector.getStartPositions
  );

  public readonly endPositions$ = this.store.select(
    CalculationResultSelector.getEndPositions
  );

  public readonly radialClearance$ = this.store.select(
    CalculationResultSelector.getRadialClearance
  );

  public readonly radialClearanceClasses$ = this.store.select(
    CalculationResultSelector.getClearanceClasses
  );

  public readonly hasMountingTools$ = this.store.select(
    CalculationResultSelector.hasMountingTools
  );

  public readonly reportSelectionTypes$ = this.store.select(
    CalculationResultSelector.getReportSelectionTypes
  );

  public readonly bearinxVersions$ = this.store.select(
    CalculationResultSelector.getVersions
  );

  constructor(private readonly store: Store) {}

  calculateResultFromForm(): void {
    this.store.dispatch(CalculationOptionsActions.calculateResultFromOptions());
  }
}
