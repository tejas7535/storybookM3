import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin, map, Observable, take, tap } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';

import { environment } from '../../../environments/environment';
import {
  demandCharacteristicOptions,
  materialClassificationOptions,
} from '../../feature/material-customer/model';
import {
  execIntervalOptions,
  whenOptions,
} from '../../pages/alert-rules/table/components/modals/alert-rule-edit-single-modal/alert-rule-options-config';
import { SelectableValue } from '../components/inputs/autocomplete/selectable-values.utils';

/**
 * The OptionsLoadingResult Interface
 *
 * @export
 * @interface OptionsLoadingResult
 */
export interface OptionsLoadingResult {
  options: SelectableValue[];
  loading?: boolean;
  loadingError?: string | null;
}

/**
 * An internal Interface used for the Map
 *
 * @interface OptionsTypes
 */
export interface OptionsTypes {
  alertTypesForRuleEditor: OptionsLoadingResult;
  alertTypes: OptionsLoadingResult;
  region: OptionsLoadingResult;
  demandPlanners: OptionsLoadingResult;
  sector: OptionsLoadingResult;
  productionPlant: OptionsLoadingResult;
  sectorMgmt: OptionsLoadingResult;
  salesArea: OptionsLoadingResult;
  salesOrg: OptionsLoadingResult;
  gkam: OptionsLoadingResult;
  productLine: OptionsLoadingResult;
  stochasticType: OptionsLoadingResult;
  interval: OptionsLoadingResult;
  execDay: OptionsLoadingResult;
  demandCharacteristics: OptionsLoadingResult;
  materialClassification: OptionsLoadingResult;
}

/**
 * The SelectableOptionsService to preload all needed options
 *
 * @export
 * @class SelectableOptionsService
 */
@Injectable({ providedIn: 'root' })
export class SelectableOptionsService {
  /**
   * The current loading state indicator.
   *
   * @memberof SelectableOptionsService
   */
  public loading$ = new BehaviorSubject<boolean>(true);

  /**
   * This map holds all the preloaded options.
   *
   * @private
   * @type {Map<keyof OptionsTypes, OptionsLoadingResult>}
   * @memberof SelectableOptionsService
   */
  private readonly _data: Map<keyof OptionsTypes, OptionsLoadingResult> =
    new Map();

  /**
   * The HttpClient instance.
   *
   * @private
   * @memberof SelectableOptionsService
   */
  private readonly http = inject(HttpClient);

  /**
   * The TranslocoService instance
   *
   * @private
   * @memberof SelectableOptionsService
   */
  private readonly translocoService = inject(TranslocoService);

  /**
   * Creates an instance of SelectableOptionsService.
   *
   * @memberof SelectableOptionsService
   */
  public constructor() {
    this.preload();
    this.setStatics();
  }

  /**
   * Returns the already preloaded options to a given key.
   *
   * @param {keyof OptionsTypes} key
   * @return {OptionsLoadingResult}
   * @memberof SelectableOptionsService
   */
  public get(key: keyof OptionsTypes): OptionsLoadingResult {
    return this._data.has(key) ? this._data.get(key) : { options: [] };
  }

  /**
   * A method to load options from outside
   *
   * @param {string} urlBegin
   * @param {string} searchTerm
   * @param {boolean} [withLang=false]
   * @return
   * @memberof SelectableOptionsService
   */
  public getOptionsBySearchTerm(
    urlBegin: string,
    searchTerm: string,
    withLang = false
  ) {
    const language: string | null = `&lang=${
      withLang ? this.translocoService.getActiveLang() : null
    }`;

    return this.http.get<SelectableValue[]>(
      `/api/${urlBegin}?search=${searchTerm}${language}`
    );
  }

  /**
   * This method build the call.
   *
   * @private
   * @param {string} path
   * @param {SelectableValue[]} [currentSelection]
   * @return {Observable<OptionsLoadingResult>}
   * @memberof SelectableOptionsService
   */
  private call(
    path: string,
    currentSelection?: SelectableValue[]
  ): Observable<OptionsLoadingResult> {
    return this.http
      .get<SelectableValue[]>(`${environment.apiUrl}global-selection/${path}`)
      .pipe(
        map((data: SelectableValue[]) => {
          const options = data ?? [];

          if (currentSelection) {
            currentSelection.forEach((selectedOption) => {
              if (!options.some((v) => v.id === selectedOption.id)) {
                options.push(selectedOption);
              }
            });
          }

          return { options, loading: false, loadingError: null };
        })
      );
  }

  /**
   * This method sets some static data.
   *
   * @private
   * @memberof SelectableOptionsService
   */
  private setStatics(): void {
    const optionsData: {
      key: keyof OptionsTypes;
      options: string[];
      translateKey: string;
    }[] = [
      {
        key: 'interval',
        options: execIntervalOptions,
        translateKey: 'alert_rules.edit_modal.label.interval.',
      },
      {
        key: 'execDay',
        options: whenOptions,
        translateKey: 'alert_rules.edit_modal.label.when.',
      },
      {
        key: 'demandCharacteristics',
        options: demandCharacteristicOptions,
        translateKey: 'field.demandCharacteristic.value.',
      },
      {
        key: 'materialClassification',
        options: materialClassificationOptions,
        translateKey: '',
      },
    ];

    optionsData.forEach((data) => {
      const optionsWithText = data.options.map((option) => ({
        id: option,
        text: translate(`${data.translateKey}${option}`),
      }));

      this._data.set(data.key, {
        options: optionsWithText,
        loading: false,
        loadingError: null,
      });
    });
  }

  /**
   * This method loads all data.
   *
   * @private
   * @memberof SelectableOptionsService
   */
  private preload() {
    const language: string = this.translocoService.getActiveLang();

    forkJoin({
      alertTypesForRuleEditor: this.call(
        `alert-types?language=${language}&isRuleEditor=true`
      ),
      alertTypes: this.call(`alert-types-open?language=${language}`),
      region: this.call(`regions`),
      demandPlanners: this.call(`demand-planners`),
      sector: this.call(`sectors?language=${language}`),
      productionPlant: this.call(`product-plants`),
      sectorMgmt: this.call(`sector-mgmt`),
      salesArea: this.call(`sales-areas`),
      salesOrg: this.call(`sales-organisations?language=${language}`),
      gkam: this.call(`key-accounts`),
      productLine: this.call(`product-line`),
      stochasticType: this.call(`stochastic-types?language=${language}`),
    })
      .pipe(
        take(1),
        tap((data) => {
          Object.keys(data).forEach((key) => {
            const value = (data as any)[key];

            if (key === 'alertTypes') {
              value.options = ((data as any)[key]?.options ?? [])?.map(
                (item: any) => ({
                  id: item.id,
                  text: translate(`alert.category.${item.id}`),
                })
              );
            }

            this._data.set(key as keyof OptionsTypes, value);
          });
          this.loading$.next(false);
        })
      )
      .subscribe();
  }
}
