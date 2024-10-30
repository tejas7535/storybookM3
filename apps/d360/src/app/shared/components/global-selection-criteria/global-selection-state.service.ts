import { Injectable, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SelectableValue } from '../inputs/autocomplete/selectable-values.utils';

/**
 * An internal interface for the Global form structure
 *
 * @interface GlobalSelectionFilters
 */
export interface GlobalSelectionFilters {
  region: FormControl<SelectableValue[]>;
  salesArea: FormControl<SelectableValue[]>;
  sectorManagement: FormControl<SelectableValue[]>;
  salesOrg: FormControl<SelectableValue[]>;
  gkamNumber: FormControl<SelectableValue[]>;
  customerNumber: FormControl<SelectableValue[]>;
  materialClassification: FormControl<SelectableValue[]>;
  sector: FormControl<SelectableValue[]>;
  materialNumber: FormControl<SelectableValue[]>;
  productionPlant: FormControl<SelectableValue[]>;
  productionSegment: FormControl<SelectableValue[]>;
  alertType: FormControl<SelectableValue[]>;
}

/**
 * The interface for the Global State.
 *
 * @export
 * @interface GlobalSelectionState
 */
export interface GlobalSelectionState {
  region: SelectableValue[];
  salesArea: SelectableValue[];
  sectorManagement: SelectableValue[];
  salesOrg: SelectableValue[];
  gkamNumber: SelectableValue[];
  customerNumber: SelectableValue[];
  materialClassification: SelectableValue[];
  sector: SelectableValue[];
  materialNumber: SelectableValue[];
  productionPlant: SelectableValue[];
  productionSegment: SelectableValue[];
  alertType: SelectableValue[];
}

export type GlobalSelectionStateKeys = keyof GlobalSelectionState;

@Injectable({ providedIn: 'root' })
export class GlobalSelectionStateService {
  /**
   * The storage instance can be localStorage or sessionStorage.
   *
   * @private
   * @type {Storage}
   * @memberof GlobalSelectionStateService
   */
  private readonly storage: Storage = sessionStorage;

  /**
   * The static formGroup, this is needed to get the available keys.
   *
   * @private
   * @static
   * @type {FormGroup<GlobalSelectionFilters>}
   * @memberof GlobalSelectionStateService
   */
  private static readonly _form: FormGroup<GlobalSelectionFilters> =
    new FormGroup({
      region: new FormControl<SelectableValue[]>([]),
      salesArea: new FormControl<SelectableValue[]>([]),
      sectorManagement: new FormControl<SelectableValue[]>([]),
      salesOrg: new FormControl<SelectableValue[]>([]),
      gkamNumber: new FormControl<SelectableValue[]>([]),
      customerNumber: new FormControl<SelectableValue[]>([]),
      materialClassification: new FormControl<SelectableValue[]>([]),
      sector: new FormControl<SelectableValue[]>([]),
      materialNumber: new FormControl<SelectableValue[]>([]),
      productionPlant: new FormControl<SelectableValue[]>([]),
      productionSegment: new FormControl<SelectableValue[]>([]),
      alertType: new FormControl<SelectableValue[]>([]),
    });

  /**
   * The available state keys.
   *
   * @static
   * @type {GlobalSelectionStateKeys[]}
   * @memberof GlobalSelectionStateService
   */
  public static readonly stateKeys: GlobalSelectionStateKeys[] = Object.keys(
    GlobalSelectionStateService._form.getRawValue()
  ) as GlobalSelectionStateKeys[];

  /**
   * This name is used to persist the keys in the storage
   *
   * @static
   * @type {string}
   * @memberof GlobalSelectionStateService
   */
  public static readonly STORAGE_NAME: string = 'global-selection';

  /**
   * The form group instance with all possible filters.
   *
   * @type {WritableSignal<FormGroup<GlobalSelectionFilters>>}
   * @memberof GlobalSelectionStateService
   */
  public form: WritableSignal<FormGroup<GlobalSelectionFilters>> = signal<
    FormGroup<GlobalSelectionFilters>
  >(GlobalSelectionStateService._form);

  /**
   * Creates an instance of GlobalSelectionStateService.
   *
   * @memberof GlobalSelectionStateService
   */
  public constructor() {
    // set the initial state
    this.setInitialState();

    // save the initial state in the storage.
    this.saveState();
  }

  /**
   * Returns the current global filter state.
   *
   * @return {GlobalSelectionState}
   * @memberof GlobalSelectionStateService
   */
  public getState(): GlobalSelectionState {
    return this.form().getRawValue();
  }

  /**
   * Reset the global state data.
   *
   * @memberof GlobalSelectionStateService
   */
  public resetState(): void {
    Object.keys(this.getState()).forEach((key) =>
      this.form().get(key)?.setValue([])
    );

    this.saveState();
  }

  /**
   * Save the current state in the Local-/Session Storage
   *
   * @memberof GlobalSelectionStateService
   */
  public saveState(): void {
    this.storage.setItem(
      GlobalSelectionStateService.STORAGE_NAME,
      JSON.stringify(this.form().getRawValue())
    );
  }

  /**
   * Check if the global selection state is empty, indicating the user has not selected any filters.
   *
   * @return {boolean}
   * @memberof GlobalSelectionStateService
   */
  public isEmpty(): boolean {
    return Object.values(this.getState()).every((value) => value.length === 0);
  }

  /**
   * Set the initial state.
   * - Read from Local-/Session Storage and pass the values to the formGroup.
   *
   * @private
   * @memberof GlobalSelectionStateService
   */
  private setInitialState(): void {
    this.form.update((current) => {
      current.setValue({
        ...current.getRawValue(),
        ...JSON.parse(
          this.storage.getItem(GlobalSelectionStateService.STORAGE_NAME) || '{}'
        ),
      });

      return current;
    });
  }
}
