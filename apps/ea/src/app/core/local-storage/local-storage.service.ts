import { Inject, Injectable, OnDestroy } from '@angular/core';

import {
  combineLatest,
  distinctUntilChanged,
  filter,
  skip,
  Subject,
  takeUntil,
} from 'rxjs';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

import {
  CATALOG_COMBINED_KEY_VALUES,
  CATALOG_LUBRICATION_METHOD_KEY_MAPPING,
  CATALOG_LUBRICATION_METHOD_VALUE_MAPPING,
  CATALOG_VALUES_DEFAULT_VALUE_SKIP,
} from '../services/catalog.service.constant';
import { CalculationParametersFacade } from '../store';
import {
  CalculationParametersActions,
  CalculationTypesActions,
} from '../store/actions';
import {
  CalculationParametersCalculationTypes,
  CalculationParametersOperationConditions,
  CalculationType,
  LoadCaseData,
  ProductSelectionTemplate,
} from '../store/models';
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
    private readonly calculationParametersFacade: CalculationParametersFacade
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
    const { version, operationConditions, calculationTypes } =
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
      this.calculationParametersFacade.dispatch(
        CalculationParametersActions.operatingParameters({
          operationConditions: this.applyTemplateToStoredOperationConditions(
            operationConditions,
            loadcaseTemplates,
            operationConditionsTemplates
          ),
        })
      );
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
        )
      )
      .subscribe(([calculationTypes, operationConditions]) => {
        this.saveSessionParameters({
          version: this.VERSION,
          validUntil: Date.now() / 1000 + this.TIME_TO_LIVE,
          operationConditions,
          calculationTypes: Object.fromEntries(
            Object.entries(calculationTypes).map(([key, value]) => [
              key,
              value.disabled || !value.visible
                ? this.sessionParameters?.calculationTypes?.[
                    key as CalculationType
                  ] ?? value.selected
                : value.selected,
            ])
          ) as Record<CalculationType, boolean>,
        });
      });
  }

  private applyTemplateToStoredOperationConditions(
    storedOperationConditions: Partial<CalculationParametersOperationConditions>,
    loadcaseTemplates: ProductSelectionTemplate[],
    operationConditionsTemplates: ProductSelectionTemplate[]
  ): Partial<CalculationParametersOperationConditions> {
    const templates = [...loadcaseTemplates, ...operationConditionsTemplates];

    // flat operation conditions
    const operationConditions: Partial<CalculationParametersOperationConditions> =
      Object.fromEntries(
        this.mapEntries(Object.entries(storedOperationConditions), templates)
      );

    // lubrication
    operationConditions.lubrication = {
      ...storedOperationConditions.lubrication,
      ...Object.fromEntries(
        this.mapEntries(
          Object.entries(storedOperationConditions.lubrication),
          templates
        )
      ),
    };
    // check selected lubrication
    const selectedLubricationKey = CATALOG_LUBRICATION_METHOD_VALUE_MAPPING.get(
      storedOperationConditions.lubrication.lubricationSelection
    );

    const lubricationMethodTemplate = templates.find(
      (template) => template.id === 'IDL_LUBRICATION_METHOD'
    );

    operationConditions.lubrication.lubricationSelection = (
      lubricationMethodTemplate.options.some(
        (option) => option.value === selectedLubricationKey
      )
        ? storedOperationConditions.lubrication.lubricationSelection
        : CATALOG_LUBRICATION_METHOD_KEY_MAPPING.get(
            lubricationMethodTemplate.defaultValue
          )
    ) as 'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil';

    // load case data
    operationConditions.loadCaseData =
      storedOperationConditions.loadCaseData.map(
        (storedLoadCaseData) =>
          ({
            ...Object.fromEntries(
              this.mapEntries(Object.entries(storedLoadCaseData), templates)
            ),
            load: Object.fromEntries(
              this.mapEntries(
                Object.entries(storedLoadCaseData.load),
                templates
              )
            ),
            rotation: Object.fromEntries(
              this.mapEntries(
                Object.entries(storedLoadCaseData.rotation),
                templates
              )
            ),
          } as LoadCaseData)
      );

    return operationConditions;
  }

  private mapEntries(
    entries: [key: string, value: any][],
    templates: ProductSelectionTemplate[]
  ) {
    return entries
      .filter(([key, _value]) =>
        templates.some(
          (template) => template.id === CATALOG_COMBINED_KEY_VALUES.get(key)
        )
      )
      .map(([key, value]) => {
        let defaultValue: string | number;
        if (
          !value &&
          value !== null &&
          !CATALOG_VALUES_DEFAULT_VALUE_SKIP.includes(key)
        ) {
          defaultValue = templates.find(
            (template) => template.id === CATALOG_COMBINED_KEY_VALUES.get(key)
          ).defaultValue;
        }

        if (Number.parseFloat(defaultValue as string) === 0) {
          defaultValue = undefined;
        }

        if (!Number.isNaN(Number.parseFloat(defaultValue as string))) {
          defaultValue = Number.parseFloat(defaultValue as string);
        }

        return [key, value ?? defaultValue];
      });
  }

  private getStoredSessionParameters(): EAParametersLocalStorageItem {
    let storedParameters: EAParametersLocalStorageItem;
    try {
      storedParameters = JSON.parse(this.localStorage.getItem(this.KEY));
      if (
        !storedParameters ||
        Date.now() / 1000 > storedParameters.validUntil
      ) {
        return {
          version: undefined,
          validUntil: undefined,
          operationConditions: undefined,
          calculationTypes: undefined,
        };
      }
    } catch {
      return {
        version: undefined,
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
