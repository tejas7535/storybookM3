import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { combineLatest, filter, map, Observable } from 'rxjs';

import {
  StepConfiguration,
  StepManagerService,
} from '@mm/shared/services/step-manager/step-manager.service';
import { Store } from '@ngrx/store';

import { EaEmbeddedService } from '@schaeffler/engineering-apps-behaviors/utils';

import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { Bearing } from '../../models/calculation-selection-state.model';
import { CalculationSelectionSelector } from '../../selectors';
import { getCalculationPerformed } from '../../selectors/calculation-options/calculation-options.selector';
import { isResultAvailable } from '../../selectors/calculation-result/calculation-result.selector';
import { isThermal } from '../../selectors/calculation-selection/calculation-selection.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationSelectionFacade {
  private readonly store = inject(Store);
  private readonly stepManagerService = inject(StepManagerService);
  private readonly embeddedService = inject(EaEmbeddedService);

  public readonly selectedBearingOption = toSignal(
    this.getBearing$().pipe(
      filter((bearing) => !!bearing),
      map((bearing) => ({
        id: bearing.bearingId,
        title: bearing.title,
        isThermal: bearing.isThermal,
        isMechanical: bearing.isMechanical,
        isHydraulic: bearing.isHydraulic,
      }))
    )
  );

  public readonly bearingResultList$ = this.store.select(
    CalculationSelectionSelector.getBearingsResultList
  );

  public readonly bearingSeats$ = this.store.select(
    CalculationSelectionSelector.getBearingSeats
  );

  public readonly measurementMethods$ = this.store.select(
    CalculationSelectionSelector.getMeasurementMethods
  );

  public readonly mountingMethods$ = this.store.select(
    CalculationSelectionSelector.getMountingMethods
  );

  public readonly stepIndices$ = this.store.select(
    CalculationSelectionSelector.getStoredStepIndices
  );

  public readonly availableSteps$ = this.store.select(
    CalculationSelectionSelector.getAvailableSteps
  );

  public readonly storedStepConfiguration$ = this.store.select(
    CalculationSelectionSelector.getStoredStepConfiguration
  );

  public readonly bearingStepIndex = this.store.selectSignal(
    CalculationSelectionSelector.getBearingStepIndex
  );

  public readonly bearingSeatStepIndex = this.store.selectSignal(
    CalculationSelectionSelector.getBearingSeatStepIndex
  );

  public readonly measuringMountingStepIndex = this.store.selectSignal(
    CalculationSelectionSelector.getMeasuringMountingStepIndex
  );

  public readonly calculationOptionsStepIndex = this.store.selectSignal(
    CalculationSelectionSelector.getCalculationOptionsStepIndex
  );

  public readonly resultStepIndex = this.store.selectSignal(
    CalculationSelectionSelector.getResultStepIndex
  );
  public readonly isThermal = this.store.selectSignal(isThermal);

  public isLoading$(): Observable<boolean> {
    return this.store.select(
      CalculationSelectionSelector.getBearingSelectionLoading
    );
  }

  public getCurrentStep$(): Observable<number> {
    return this.store.select(CalculationSelectionSelector.getCurrentStep);
  }

  public getBearing$(): Observable<Bearing> {
    return this.store.select(CalculationSelectionSelector.getBearing);
  }

  public getBearingSeatId$(): Observable<string> {
    return this.store.select(CalculationSelectionSelector.getBearingSeatId);
  }

  public getMeasurementMethod$(): Observable<string> {
    return this.store.select(CalculationSelectionSelector.getMeasurementMethod);
  }

  public getMountingMethod$(): Observable<string> {
    return this.store.select(CalculationSelectionSelector.getMountingMethod);
  }

  public isAxialDisplacement$(): Observable<boolean> {
    return this.store.select(CalculationSelectionSelector.isAxialDisplacement);
  }

  searchBearing(query: string): void {
    this.store.dispatch(
      CalculationSelectionActions.searchBearingList({ query })
    );
  }

  resetBearingSelection(): void {
    this.store.dispatch(CalculationSelectionActions.resetBearing());
    this.store.dispatch(CalculationResultActions.resetCalculationResult());
  }

  fetchBearingData(bearingId: string): void {
    this.store.dispatch(
      CalculationSelectionActions.fetchBearingData({
        bearingId,
      })
    );
  }

  setCurrentStep(step: number, isBackNavigation?: boolean): void {
    this.store.dispatch(
      CalculationSelectionActions.setCurrentStep({ step, isBackNavigation })
    );
  }

  fetchBearingSeats(): void {
    this.store.dispatch(CalculationSelectionActions.fetchBearingSeats());
  }

  setBearingSeat(bearingSeatId: string): void {
    this.store.dispatch(
      CalculationSelectionActions.setBearingSeat({ bearingSeatId })
    );
  }

  setMeasurementMethod(measurementMethod: string): void {
    if (measurementMethod) {
      this.store.dispatch(
        CalculationSelectionActions.setMeasurementMethod({ measurementMethod })
      );
    }
  }

  updateMountingMethodAndCurrentStep(mountingMethod: string): void {
    this.store.dispatch(
      CalculationSelectionActions.updateMountingMethodAndCurrentStep({
        mountingMethod,
      })
    );
  }

  getStepConfiguration$(): Observable<StepConfiguration> {
    return combineLatest([
      this.getBearing$(),
      this.isAxialDisplacement$(),
      this.getBearingSeatId$(),
      this.getMountingMethod$(),
      this.store.select(getCalculationPerformed),
      this.store.select(isResultAvailable),
    ]).pipe(
      map(
        ([
          bearing,
          isAxialBearing,
          bearingSeatId,
          mountingMethod,
          optionsCalculationPerformed,
          resultAvailable,
        ]) =>
          this.stepManagerService.getStepConfiguration({
            bearing,
            isAxialBearing,
            isEmbedded: !this.embeddedService.isStandalone(),
            completionState: {
              bearingSeatId,
              mountingMethod,
              optionsCalculationPerformed,
              isResultAvailable: resultAvailable,
            },
          })
      )
    );
  }
}
