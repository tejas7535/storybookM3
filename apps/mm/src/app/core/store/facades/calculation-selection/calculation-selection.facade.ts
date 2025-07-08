import { Injectable } from '@angular/core';

import { filter, map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { Bearing } from '../../models/calculation-selection-state.model';
import { CalculationSelectionSelector } from '../../selectors';

@Injectable({
  providedIn: 'root',
})
export class CalculationSelectionFacade {
  public readonly steps$ = this.store.select(
    CalculationSelectionSelector.getSteps
  );

  public readonly selectedBearingOption$ = this.getBearing$().pipe(
    filter((bearing) => !!bearing),
    map((bearing) => ({
      id: bearing.bearingId,
      title: bearing.title,
    }))
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

  constructor(private readonly store: Store) {}

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
      CalculationSelectionActions.fetchBearingData({ bearingId })
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
}
