/* eslint-disable max-lines */
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Params, Router } from '@angular/router';

import {
  combineLatest,
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { GlobalSelectionHelperService } from '../../../feature/global-selection/global-selection.service';
import {
  CustomerEntry,
  GlobalSelectionCriteriaFields,
  GlobalSelectionStatus,
} from '../../../feature/global-selection/model';
import {
  OptionsTypes,
  SelectableOptionsService,
} from '../../services/selectable-options.service';
import {
  ResolveSelectableValueResult,
  SelectableValue,
} from '../inputs/autocomplete/selectable-values.utils';

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
   * The router instance to navigate within the application.
   *
   * @private
   * @type {Router}
   * @memberof GlobalSelectionStateService
   */
  private readonly router: Router = inject(Router);

  /**
   * The GlobalSelectionHelperService instance.
   *
   * @private
   * @type {GlobalSelectionHelperService}
   * @memberof GlobalSelectionStateService
   */
  private readonly helperService: GlobalSelectionHelperService = inject(
    GlobalSelectionHelperService
  );

  /**
   * The SelectableOptionsService instance.
   *
   * @private
   * @type {SelectableOptionsService}
   * @memberof GlobalSelectionStateService
   */
  private readonly optionsService: SelectableOptionsService = inject(
    SelectableOptionsService
  );

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
   * Returns the current GlobalSelectionStatus.
   *
   * @param {({ data: CustomerEntry[] | undefined })} customerData
   * @param {(CustomerEntry | undefined)} selectedCustomer
   * @return {GlobalSelectionStatus}
   * @memberof GlobalSelectionHelperService
   */
  public getGlobalSelectionStatus(
    customerData: { data: CustomerEntry[] | undefined },
    selectedCustomer: CustomerEntry | undefined
  ): GlobalSelectionStatus {
    const currentState: GlobalSelectionState = this.getState();

    if (!currentState || this.isEmpty()) {
      return GlobalSelectionStatus.DATA_NOTHING_SELECTED;
    } else if (
      currentState &&
      customerData.data &&
      customerData.data.length === 0
    ) {
      return GlobalSelectionStatus.DATA_NO_RESULTS;
    } else if (selectedCustomer && customerData.data) {
      return GlobalSelectionStatus.DATA_AVAILABLE;
    }

    return GlobalSelectionStatus.DATA_ERROR;
  }

  /**
   * Navigates to a new page with updated global selection criteria.
   *
   * @param {string} path - The route to navigate to.
   * @param {(GlobalSelectionCriteriaFields | undefined)} newGlobalSelection - The new selection criteria.
   * @param {NavigationExtras} [extras] - Optional navigation options.
   * @returns {Observable<boolean>}
   * @memberof GlobalSelectionStateService
   */
  public navigateWithGlobalSelection(
    path: string,
    newGlobalSelection: GlobalSelectionCriteriaFields | undefined,
    extras?: NavigationExtras
  ): Observable<boolean> {
    const globalSelectionToStore =
      newGlobalSelection &&
      Object.values(newGlobalSelection).some((field) => field.length > 0)
        ? newGlobalSelection
        : undefined;

    this.resetState();

    if (globalSelectionToStore) {
      this.overrideState(globalSelectionToStore);
    }

    const navigationExtras = {
      ...extras,
      state: { ...extras?.state, globalSelection: globalSelectionToStore },
    };

    return from(this.router.navigate([path], navigationExtras));
  }

  /**
   * Handle the Global Selection values in the URL
   *
   * @param {Params} params
   * @return {Observable<boolean>}
   * @memberof GlobalSelectionStateService
   */
  public handleQueryParams$(params: Params): Observable<boolean> {
    const allowedKeys: GlobalSelectionStateKeys[] =
      GlobalSelectionStateService.stateKeys;
    const globalSelections: Partial<GlobalSelectionCriteriaFields> = {};

    return this.optionsService.loading$.pipe(
      filter((loading) => !loading),
      take(1),
      switchMap(() => {
        const observables$: Observable<Partial<GlobalSelectionState>>[] =
          Object.entries(params)
            .filter(([key, _value]) =>
              allowedKeys.includes(key as GlobalSelectionStateKeys)
            )
            .map(([key, value]) =>
              this.resolveIds$(
                key as GlobalSelectionStateKeys,
                Array.isArray(value) ? value : [value]
              )
            );

        return combineLatest(observables$);
      }),
      tap((results: Partial<GlobalSelectionState>[]) => {
        results.forEach((result) => Object.assign(globalSelections, result));
        this.overrideState(globalSelections);
      }),
      map(() => true)
    );
  }

  /**
   * Resolve ids to the needed Selected Values.
   * Hint: If we want to enable aliases too, we just need to extend 'resolveFnMap', 'optionsMap' and 'resolveWithoutOptions'
   *
   * Currently allowed keys are:
   * - alertType
   * - customerNumber
   * - gkamNumber
   * - materialClassification
   * - materialNumber
   * - productionPlant
   * - productionSegment
   * - region
   * - salesArea
   * - salesOrg
   * - sector
   * - sectorManagement
   *
   * @private
   * @param {GlobalSelectionStateKeys} key
   * @param {string[]} ids
   * @return {Observable<Partial<GlobalSelectionState>>}
   * @memberof GlobalSelectionStateService
   */
  private resolveIds$(
    key: GlobalSelectionStateKeys,
    ids: string[]
  ): Observable<Partial<GlobalSelectionState>> {
    // prettier-ignore
    // eslint-disable-next-line @typescript-eslint/ban-types
    const resolveFnMap: Record<string, Function> = {
      alertType: this.helperService.resolveAlertTypes.bind(this.helperService),
      customerNumber: this.helperService.resolveCustomerNumbers.bind(this.helperService),
      gkamNumber: this.helperService.resolveGkamNumber.bind(this.helperService),
      materialClassification: this.helperService.resolveFor2Characters.bind(this.helperService),
      materialNumber: this.helperService.resolveMaterialNumbers.bind(this.helperService),
      productionPlant: this.helperService.resolveProductionPlants.bind(this.helperService),
      productionSegment: this.helperService.resolveProductionSegment.bind(this.helperService),
      region: this.helperService.resolveFor2Characters.bind(this.helperService),
      salesArea: this.helperService.resolveForText.bind(this.helperService),
      salesOrg: this.helperService.resolveSalesOrg.bind(this.helperService),
      sector: this.helperService.resolveSectors.bind(this.helperService),
      sectorManagement: this.helperService.resolveFor2Characters.bind(this.helperService),
    };

    const optionsMap: Record<string, string> = {
      alertType: 'alertTypes',
      gkamNumber: 'gkam',
      materialClassification: 'materialClassification',
      materialNumber: 'materialNumber',
      productionPlant: 'productionPlant',
      region: 'region',
      salesArea: 'salesArea',
      salesOrg: 'salesOrg',
      sector: 'sector',
      sectorManagement: 'sectorMgmt',
    };

    const resolveWithoutOptions: string[] = [
      'customerNumber',
      'productionSegment',
    ];

    let resolvedData$: Observable<ResolveSelectableValueResult[]>;

    if (resolveWithoutOptions.includes(key)) {
      resolvedData$ = resolveFnMap[key](ids);
    } else if (resolveFnMap[key] && optionsMap[key]) {
      resolvedData$ = resolveFnMap[key](
        ids,
        this.optionsService.get(optionsMap[key] as keyof OptionsTypes).options
      );
    } else {
      resolvedData$ = of(null);
    }

    return resolvedData$.pipe(
      map((data) => {
        const values: SelectableValue[] = data
          .filter((result) => !!result && result.selectableValue)
          .map((result) => result.selectableValue);

        return { [key]: values };
      })
    );
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

  /**
   * Override the current state with the given state.
   *
   * @private
   * @param {GlobalSelectionCriteriaFields} globalSelectionToStore
   * @memberof GlobalSelectionStateService
   */
  private overrideState(globalSelectionToStore: GlobalSelectionCriteriaFields) {
    this.resetState();

    this.form.update((current: FormGroup<GlobalSelectionFilters>) => {
      current.setValue({
        ...current.getRawValue(),
        ...globalSelectionToStore,
      });

      return current;
    });

    this.saveState();
  }
}
