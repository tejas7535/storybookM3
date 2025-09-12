import { inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { CalculationOptionsActions } from '../actions';
import { CalculationResultActions } from '../actions/calculation-result';
import { CalculationResultSelector } from '../selectors';
import { CalculationSelectionFacade } from './calculation-selection/calculation-selection.facade';

@Injectable({
  providedIn: 'root',
})
export class CalculationResultFacade {
  private readonly store: Store = inject(Store);
  private readonly calculationSelectionFacade: CalculationSelectionFacade =
    inject(CalculationSelectionFacade);

  public readonly calculationInputs = this.store.selectSignal(
    CalculationResultSelector.getCalculationInputs
  );

  public readonly getCalulationMessages$ = this.store.select(
    CalculationResultSelector.getCalculationMessages
  );

  public readonly isResultAvailable$ = this.store.select(
    CalculationResultSelector.isResultAvailable
  );

  public readonly isResultAvailable = this.store.selectSignal(
    CalculationResultSelector.isResultAvailable
  );

  public readonly isLoading$ = this.store.select(
    CalculationResultSelector.isLoading
  );

  public readonly mountingRecommendations = this.store.selectSignal(
    CalculationResultSelector.getMountingRecommendations
  );

  public readonly mountingTools = this.store.selectSignal(
    CalculationResultSelector.getMountingTools
  );

  public readonly startPositions = this.store.selectSignal(
    CalculationResultSelector.getStartPositions
  );

  public readonly endPositions = this.store.selectSignal(
    CalculationResultSelector.getEndPositions
  );

  public readonly radialClearance = this.store.selectSignal(
    CalculationResultSelector.getRadialClearance
  );

  public readonly radialClearanceClasses = this.store.selectSignal(
    CalculationResultSelector.getClearanceClasses
  );

  public readonly temperatures = this.store.selectSignal(
    CalculationResultSelector.getTemperatures
  );

  public readonly hasMountingTools = this.store.selectSignal(
    CalculationResultSelector.hasMountingTools
  );

  public readonly reportSelectionTypes = this.store.selectSignal(
    CalculationResultSelector.getReportSelectionTypes
  );

  public readonly bearinxVersions$ = this.store.select(
    CalculationResultSelector.getVersions
  );

  calculateResultFromForm(): void {
    const resultStepIndex = this.calculationSelectionFacade.resultStepIndex();
    this.calculationSelectionFacade.setCurrentStep(resultStepIndex);
    this.store.dispatch(
      CalculationOptionsActions.setCalculationPerformed({ performed: true })
    );
    this.store.dispatch(CalculationOptionsActions.calculateResultFromOptions());
  }

  calculateThermalResultFromForm(): void {
    this.store.dispatch(
      CalculationOptionsActions.setCalculationPerformed({ performed: true })
    );
    this.store.dispatch(
      CalculationResultActions.calculateThermalResultFromOptions()
    );
  }
}
