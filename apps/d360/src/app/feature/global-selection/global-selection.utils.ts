import { HttpClient } from '@angular/common/http';

import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import {
  GlobalSelectionState,
  GlobalSelectionStateKeys,
  GlobalSelectionStateService,
} from '../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  ResolveSelectableValueResult,
  SelectableValue,
} from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { generateUrlWithSearchTerm } from '../../shared/utils/http-client';
import { GlobalSelectionCriteriaFilters } from './model';

/**
 * Internal interface for ResolveOptions
 *
 * @interface ResolveOptions
 */
interface ResolveOptions {
  values: string[];
  options: SelectableValue[];
  formatFunc?: (value: string) => string;
  validateFunc?: (value: string) => string[] | null;
  errorTextFunc?: (value: string) => string;
}

/**
 * Internal interface for ResolveOptionsOnType
 *
 * @interface ResolveOptionsOnType
 */
interface ResolveOptionsOnType {
  values: string[];
  urlBegin: string;
  validateFunc?: (value: string) => string[] | null;
  language?: string;
  http: HttpClient;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class GlobalSelectionUtils {
  /**
   * Splits a given array into chunks
   *
   * @static
   * @param {any[]} inputArray
   * @param {number} length
   * @return
   * @memberof GlobalSelectionUtils
   */
  public static splitToChunks(inputArray: any[], length: number) {
    const chunks = [];

    for (let index = 0; index < inputArray.length; index += length) {
      chunks.push(inputArray.slice(index, index + length));
    }

    return chunks;
  }

  /**
   * Helper function to resolve options on preload.
   *
   * @static
   * @param {ResolveOptions} {
   *     values,
   *     options,
   *     formatFunc,
   *     validateFunc,
   *     errorTextFunc,
   *   }
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionUtils
   */
  public static resolveOptions({
    values,
    options,
    formatFunc,
    validateFunc,
    errorTextFunc,
  }: ResolveOptions): Observable<ResolveSelectableValueResult[]> {
    const results = values.map((value) => {
      const validationErrors = validateFunc ? validateFunc(value) : null;

      if (validationErrors) {
        return { id: value, error: validationErrors };
      }

      const formattedValue = formatFunc ? formatFunc(value) : value;
      const optionExists = options.find((item) => item.id === formattedValue);

      if (!optionExists) {
        const errText = errorTextFunc
          ? errorTextFunc(formattedValue)
          : `error.not_valid${formattedValue}`;

        return { id: value, error: [errText] };
      }

      return { id: value, selectableValue: optionExists };
    });

    return of(results);
  }

  /**
   * Helper function to resolve options on type.
   *
   * @static
   * @param {ResolveOptionsOnType} {
   *     values,
   *     urlBegin,
   *     validateFunc,
   *     language,
   *     http,
   *   }
   * @return {Observable<ResolveSelectableValueResult[]>}
   * @memberof GlobalSelectionUtils
   */
  public static resolveOptionsOnType({
    values,
    urlBegin,
    validateFunc,
    language,
    http,
  }: ResolveOptionsOnType): Observable<ResolveSelectableValueResult[]> {
    const validatedValues: ResolveSelectableValueResult[] = values.map(
      (value) => {
        const validationErrors = validateFunc ? validateFunc(value) : null;

        return validationErrors
          ? { id: value, error: validationErrors }
          : { id: value };
      }
    );

    const requests = validatedValues.map((value) => {
      if (value.error) {
        return of(value);
      }

      const idToSearch = value.id;
      const url = generateUrlWithSearchTerm(urlBegin, idToSearch, language);

      return http.get<ResolveSelectableValueResult[]>(url).pipe(
        map((fetchedResults) =>
          fetchedResults.length > 0
            ? {
                ...value,
                selectableValue: fetchedResults[0] as SelectableValue,
              }
            : value
        ),
        // TODO: check if error handling here is correct
        catchError((entry) =>
          of({ id: entry.id, error: [`Resolving value ${entry.id} failed.`] })
        )
      );
    });

    return requests.length > 0
      ? forkJoin(requests).pipe(map(() => validatedValues))
      : of(validatedValues);
  }

  public static isGlobalSelectionCriteria(criteria: string) {
    return GlobalSelectionStateService.stateKeys.includes(
      criteria as GlobalSelectionStateKeys
    );
  }

  public static globalSelectionCriteriaToFilter(
    criteria: GlobalSelectionState | undefined
  ): GlobalSelectionCriteriaFilters | undefined {
    if (!criteria) {
      return undefined;
    }

    let filter: GlobalSelectionCriteriaFilters = {};
    Object.entries(criteria).forEach(
      ([key, filters]: [string, SelectableValue[]]) => {
        if (filters.length > 0) {
          filter = { ...filter, [key]: filters.map((v) => v.id) };
        }
      }
    );

    return filter;
  }
}
