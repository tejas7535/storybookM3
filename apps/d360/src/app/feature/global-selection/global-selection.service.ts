/* eslint-disable max-lines */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  ResolveSelectableValueResult,
  SelectableValue,
} from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { PaginatedFilteredRequest } from '../../shared/models/paginated-filtered-request';
import { SnackbarService } from '../../shared/utils/service/snackbar.service';
import {
  validateAlertTypes,
  validateCustomerNumber,
  validateFor2Characters,
  validateForText,
  validateGkamNumber,
  validateMaterialNumber,
  validateProductionPlants,
  validateProductionSegment,
  validateSalesOrg,
  validateSectors,
} from '../../shared/utils/validation/filter-validation';
import { ValidationHelper } from '../../shared/utils/validation/validation-helper';
import { MaterialCustomerService } from '../material-customer/material-customer.service';
import { GlobalSelectionUtils } from './global-selection.utils';
import { CustomerEntry } from './model';

/**
 * The GlobalSelectionHelper Service
 *
 * @export
 * @class GlobalSelectionHelperService
 */
@Injectable({ providedIn: 'root' })
export class GlobalSelectionHelperService {
  private readonly GLOBAL_SELECTION_CUSTOMER_BY_NAME_API: string =
    'api/global-selection/search-customers-by-name';
  private readonly GLOBAL_SELECTION_CUSTOMER_API: string =
    'api/global-selection/customers';
  private readonly GLOBAL_SELECTION_COUNT_API: string =
    'api/global-selection/count';
  private readonly GLOBAL_SELECTION_PRODUCT_SEGMENTS_API: string =
    'api/global-selection/production-segments';

  /**
   * The SnackbarService instance
   *
   * @private
   * @type {SnackbarService}
   * @memberof GlobalSelectionHelperService
   */
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  /**
   * The HttpClient instance
   *
   * @private
   * @type {HttpClient}
   * @memberof GlobalSelectionHelperService
   */
  private readonly http: HttpClient = inject(HttpClient);

  /**
   * The MaterialCustomerService instance
   *
   * @private
   * @type {MaterialCustomerService}
   * @memberof GlobalSelectionHelperService
   */
  private readonly materialCustomerService: MaterialCustomerService = inject(
    MaterialCustomerService
  );

  /**
   * Returns the Result Count data
   *
   * @param {(GlobalSelectionState | undefined)} globalSelection
   * @return {(Observable<number | undefined>)}
   * @memberof GlobalSelectionHelperService
   */
  public getResultCount(
    globalSelection: GlobalSelectionState | undefined
  ): Observable<number | undefined> {
    if (!globalSelection) {
      return of();
    }

    const requestBody: PaginatedFilteredRequest = {
      startRow: 0,
      endRow: 1,
      sortModel: [],
      columnFilters: [],
      selectionFilters:
        GlobalSelectionUtils.globalSelectionCriteriaToFilter(globalSelection),
    };

    return this.http
      .post<number>(this.GLOBAL_SELECTION_COUNT_API, requestBody)
      .pipe(
        map((data) => data || undefined),
        catchError(() => of())
      );
  }

  /**
   * Returns customer numbers based on global selection
   *
   * @param {(GlobalSelectionState | null | undefined)} globalSelection
   * @return {Observable<CustomerEntry[]>}
   * @memberof GlobalSelectionHelperService
   */
  public getCustomersData(
    globalSelection: GlobalSelectionState | null | undefined
  ): Observable<CustomerEntry[]> {
    if (!globalSelection) {
      return of([]);
    }

    const requestBody: PaginatedFilteredRequest = {
      startRow: 0,
      endRow: 1,
      sortModel: [] as any,
      columnFilters: [] as any,
      selectionFilters:
        GlobalSelectionUtils.globalSelectionCriteriaToFilter(globalSelection),
    };

    return this.http
      .post<CustomerEntry[]>(this.GLOBAL_SELECTION_CUSTOMER_API, requestBody)
      .pipe(
        map((data) => data || []),
        catchError(() => of([]))
      );
  }

  /**
   * Resolve the given values as ProductionSegment
   *
   * @param {string[]} values
   * @memberof GlobalSelectionHelperService
   */
  public resolveProductionSegment(
    values: string[]
  ): Observable<ResolveSelectableValueResult[]> {
    if (values.length > 150) {
      this.snackbarService.openSnackBar(
        translate('error.tooManyValues', { maxNumber: 150 })
      );

      return of([]);
    }

    return GlobalSelectionUtils.resolveOptionsOnType({
      values,
      urlBegin: this.GLOBAL_SELECTION_PRODUCT_SEGMENTS_API,
      validateFunc: validateProductionSegment,
      http: this.http,
    });
  }

  /**
   * Resolve the given values as GkamNumber
   *
   * @param {string[]} values
   * @param {SelectableValue[]} options
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveGkamNumber(
    values: string[],
    options: SelectableValue[]
  ): Observable<ResolveSelectableValueResult[]> {
    return GlobalSelectionUtils.resolveOptions({
      values,
      options,
      formatFunc: (value) => ValidationHelper.fillZeroOnValueFunc(6, value),
      validateFunc: (value) => validateGkamNumber(value),
      errorTextFunc: (formattedValue) =>
        translate('error.notValidGkamNumber', { formattedValue }),
    });
  }

  /**
   * Resolve the given values as SalesOrg
   *
   * @param {string[]} values
   * @param {SelectableValue[]} options
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveSalesOrg(
    values: string[],
    options: SelectableValue[]
  ): Observable<ResolveSelectableValueResult[]> {
    return GlobalSelectionUtils.resolveOptions({
      values,
      options,
      formatFunc: (value) => ValidationHelper.fillZeroOnValueFunc(4, value),
      validateFunc: (value) => validateSalesOrg(value),
      errorTextFunc: (formattedValue) =>
        translate('error.notValidSalesOrg', { formattedValue }),
    });
  }

  /**
   * Resolve the given values as Sectors
   *
   * @param {string[]} values
   * @param {SelectableValue[]} options
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveSectors(
    values: string[],
    options: SelectableValue[]
  ): Observable<ResolveSelectableValueResult[]> {
    return GlobalSelectionUtils.resolveOptions({
      values,
      options,
      formatFunc: undefined,
      validateFunc: (value) => validateSectors(value),
    });
  }

  /**
   * Resolve the given values as ProductionPlants
   *
   * @param {string[]} values
   * @param {SelectableValue[]} options
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveProductionPlants(
    values: string[],
    options: SelectableValue[]
  ): Observable<ResolveSelectableValueResult[]> {
    return GlobalSelectionUtils.resolveOptions({
      values,
      options,
      formatFunc: undefined,
      validateFunc: (value) => validateProductionPlants(value),
    });
  }

  /**
   * Resolve the given values as AlertTypes (open tasks)
   *
   * @param {string[]} values
   * @param {SelectableValue[]} options
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveAlertTypes(
    values: string[],
    options: SelectableValue[]
  ): Observable<ResolveSelectableValueResult[]> {
    return GlobalSelectionUtils.resolveOptions({
      values,
      options,
      formatFunc: undefined,
      validateFunc: (value) => validateAlertTypes(value),
    });
  }

  /**
   * Resolve the given values as Text
   *
   * @param {string[]} values
   * @param {SelectableValue[]} options
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveForText(
    values: string[],
    options: SelectableValue[]
  ): Observable<ResolveSelectableValueResult[]> {
    return GlobalSelectionUtils.resolveOptions({
      values,
      options,
      formatFunc: undefined,
      validateFunc: (value) => validateForText(value),
    });
  }

  /**
   * Resolve the given values as Text with exact 2 Characters
   *
   * @param {string[]} values
   * @param {SelectableValue[]} options
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveFor2Characters(
    values: string[],
    options: SelectableValue[]
  ): Observable<ResolveSelectableValueResult[]> {
    return GlobalSelectionUtils.resolveOptions({
      values,
      options,
      formatFunc: undefined,
      validateFunc: (value) => validateFor2Characters(value),
    });
  }

  /**
   * Resolve the given values as CustomerNumbers
   *
   * @param {string[]} values
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveCustomerNumbers(
    values: string[]
  ): Observable<ResolveSelectableValueResult[]> {
    const resolveResults: ResolveSelectableValueResult[] = values.map(
      (value) => {
        const validationErrors = validateCustomerNumber(value);

        if (validationErrors) {
          return { id: value, error: validationErrors };
        }

        return { id: value };
      }
    );

    const formattedCustomerNumbers = resolveResults
      .filter((entry) => !entry.error)
      .map((entry) => ValidationHelper.fillZeroOnValueFunc(10, entry.id));

    const requests = GlobalSelectionUtils.splitToChunks(
      formattedCustomerNumbers,
      100
    ).map((chunk) =>
      this.http
        .post<
          { id: string; text: string }[]
        >(this.GLOBAL_SELECTION_CUSTOMER_BY_NAME_API, chunk)
        .pipe(
          map((fetchedCustomers) => {
            fetchedCustomers.forEach((customer) => {
              const entry = resolveResults.filter(
                (e) =>
                  customer.id === ValidationHelper.fillZeroOnValueFunc(10, e.id)
              );

              if (entry) {
                entry.forEach(
                  (e) =>
                    (e.selectableValue = {
                      id: customer.id,
                      text: customer.text,
                    })
                );
              }
            });

            resolveResults.forEach((entry) => {
              if (entry.error == null && entry.selectableValue == null) {
                entry.error = [
                  translate('error.notValidCustomerNumber', {
                    formattedValue: entry.id,
                  }),
                ];
              }
            });
          })
        )
    );

    return requests.length > 0
      ? forkJoin(requests).pipe(map(() => resolveResults))
      : of(resolveResults);
  }

  /**
   * Resolve the given values as MaterialNumbers
   *
   * @param {string[]} values
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionHelperService
   */
  public resolveMaterialNumbers(
    values: string[]
  ): Observable<ResolveSelectableValueResult[]> {
    const resolveResults: ResolveSelectableValueResult[] = values.map(
      (value) => {
        const validationErrors = validateMaterialNumber(value);

        if (validationErrors) {
          return { id: value, error: validationErrors };
        }

        return { id: value };
      }
    );

    const formattedMaterialNumbers = resolveResults
      .filter((entry) => !entry.error)
      .map((entry) => entry.id.replaceAll('-', ''));

    const requests = GlobalSelectionUtils.splitToChunks(
      formattedMaterialNumbers,
      100
    ).map((chunk) =>
      this.materialCustomerService.getMaterialCustomerData(chunk).pipe(
        map((fetchedMaterials) => {
          fetchedMaterials.rows.forEach((material: any) => {
            const formattedMaterialNumber = material.materialNumber.replaceAll(
              '-',
              ''
            );
            const entry = resolveResults.filter(
              (selectableValueEntry) =>
                formattedMaterialNumber ===
                selectableValueEntry.id.replaceAll('-', '')
            );

            if (entry) {
              entry.forEach(
                (e) =>
                  (e.selectableValue = {
                    id: material.materialNumber,
                    text: material.materialDescription,
                  })
              );
            }
          });

          resolveResults.forEach((entry) => {
            if (entry.error == null && entry.selectableValue == null) {
              entry.error = [
                translate('error.notValidMaterialNumber', {
                  formattedValue: entry.id,
                }),
              ];
            }
          });
        })
      )
    );

    return requests.length > 0
      ? forkJoin(requests).pipe(map(() => resolveResults))
      : of(resolveResults);
  }
}
