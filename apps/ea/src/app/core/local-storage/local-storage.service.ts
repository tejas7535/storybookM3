import { Inject, Injectable, OnDestroy } from '@angular/core';

import {
  combineLatest,
  distinctUntilChanged,
  filter,
  skip,
  Subject,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { CalculationParametersFacade, ProductSelectionFacade } from '../store';
import {
  CalculationParametersActions,
  CalculationTypesActions,
} from '../store/actions';
import {
  CalculationParametersCalculationTypes,
  CalculationParametersOperationConditions,
  CalculationType,
  ProductSelectionTemplate,
} from '../store/models';
import { applyTemplateToStoredOperationConditions } from './catalog-bearing.helpers';
import { EAParametersLocalStorageItem } from './ea-parameters-local-storage-item.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements OnDestroy {
  private readonly VERSION = 1;
  private readonly KEY = 'EA_SESSION_PARAMETERS';
  private readonly TIME_TO_LIVE = 36_000;

  private readonly destroy$ = new Subject<void>();
  private readonly sessionParameters$ = combineLatest([
    this.calculationParametersFacade.getCalculationTypes$,
    this.calculationParametersFacade.operationConditions$,
  ]);

  private sessionParameters: EAParametersLocalStorageItem;

  constructor(
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly selectionFacade: ProductSelectionFacade
  ) {
    this.init();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public restoreStoredSession(
    templateCalculationTypes: CalculationParametersCalculationTypes,
    loadcaseTemplates: ProductSelectionTemplate[],
    operationConditionsTemplates: ProductSelectionTemplate[]
  ): void {
    const { version, operationConditions, calculationTypes, bearingKind } =
      this.getStoredSessionParameters();

    if (!version || version < this.VERSION) {
      return;
    }

    if (calculationTypes) {
      const newCalculationTypes = Object.fromEntries(
        Object.entries(templateCalculationTypes).map(([key, value]) => [
          key,
          {
            ...value,
            selected:
              calculationTypes[key as CalculationType] &&
              !value.disabled &&
              value.visible,
          },
        ])
      );

      this.calculationParametersFacade.dispatch(
        CalculationTypesActions.setCalculationTypes({
          calculationTypes:
            newCalculationTypes as CalculationParametersCalculationTypes,
        })
      );
    }

    if (operationConditions) {
      let restoredConditions: Partial<CalculationParametersOperationConditions>;
      // eslint-disable-next-line default-case
      switch (bearingKind) {
        case CATALOG_BEARING_TYPE:
          restoredConditions = applyTemplateToStoredOperationConditions(
            operationConditions,
            loadcaseTemplates,
            operationConditionsTemplates
          );
          break;
        case SLEWING_BEARING_TYPE:
          restoredConditions = operationConditions;
      }

      if (restoredConditions) {
        this.calculationParametersFacade.dispatch(
          CalculationParametersActions.operatingParameters({
            operationConditions: restoredConditions,
          })
        );
      }
    }
  }

  private init(): void {
    this.sessionParameters$
      .pipe(
        takeUntil(this.destroy$),
        skip(3),
        distinctUntilChanged(
          (
            [calculationTypesOld, operationConditionsOld],
            [calculationTypesNew, operationConditionsNew]
          ) => {
            const {
              selectedLoadcase: _,
              ...operationConditionsOldWithoutSelectedLoadcase
            } = operationConditionsOld;
            const {
              selectedLoadcase: __,
              ...operationConditionsNewWithoutSelectedLoadcase
            } = operationConditionsNew;

            return (
              JSON.stringify([
                calculationTypesOld,
                operationConditionsOldWithoutSelectedLoadcase,
              ]) ===
              JSON.stringify([
                calculationTypesNew,
                operationConditionsNewWithoutSelectedLoadcase,
              ])
            );
          }
        ),
        filter(
          ([calculationTypes, operationConditions]) =>
            !!calculationTypes && !!operationConditions
        ),
        withLatestFrom(this.selectionFacade.bearingProductClass$)
      )
      .subscribe(([[calculationTypes, operationConditions], type]) => {
        this.saveSessionParameters({
          version: this.VERSION,
          bearingKind: type,
          validUntil: Date.now() / 1000 + this.TIME_TO_LIVE,
          operationConditions,
          calculationTypes: Object.fromEntries(
            Object.entries(calculationTypes).map(([key, value]) => [
              key,
              value.disabled || !value.visible
                ? (this.sessionParameters?.calculationTypes?.[
                    key as CalculationType
                  ] ?? value.selected)
                : value.selected,
            ])
          ) as Record<CalculationType, boolean>,
        });
      });
  }

  private getStoredSessionParameters(): EAParametersLocalStorageItem {
    let storedParameters: EAParametersLocalStorageItem;
    try {
      storedParameters = JSON.parse(this.localStorage.getItem(this.KEY));
      if (
        !storedParameters ||
        Date.now() / 1000 > storedParameters.validUntil ||
        !storedParameters.bearingKind
      ) {
        return {
          version: undefined,
          bearingKind: undefined,
          validUntil: undefined,
          operationConditions: undefined,
          calculationTypes: undefined,
        };
      }
    } catch {
      return {
        version: undefined,
        bearingKind: undefined,
        validUntil: undefined,
        operationConditions: undefined,
        calculationTypes: undefined,
      };
    }

    this.sessionParameters = storedParameters;

    return storedParameters;
  }

  private saveSessionParameters(
    parameterSessionState: EAParametersLocalStorageItem
  ): void {
    this.sessionParameters = parameterSessionState;
    this.localStorage.setItem(this.KEY, JSON.stringify(parameterSessionState));
  }
}
