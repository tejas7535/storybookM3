import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { BearinxListValue, LazyListLoader } from '@caeonline/dynamic-forms';

import { environment } from '../../../../environments/environment';
import {
  IDCO_DESIGNATION,
  IDMM_HYDRAULIC_NUT_TYPE,
  RSY_BEARING,
} from '../../../shared/constants/dialog-constant';
import {
  MMBearingPreflightField,
  MMComplexResponse,
  MMResponseVariants,
  MMSimpleResponse,
  PreflightRequestBody,
} from '../../../shared/models';
import { RestService } from '../';

const isComplex = (
  response: MMResponseVariants
): response is MMComplexResponse => !Array.isArray(response.data);

const isSimple = (response: MMResponseVariants): response is MMSimpleResponse =>
  !isComplex(response) && 'data' in response.data[0];

@Injectable({
  providedIn: 'root',
})
export class LazyListLoaderService implements LazyListLoader {
  public constructor(private readonly restService: RestService) {}

  public loadOptions(
    url: string,
    values: { name: string; value: string | number }[]
  ): Observable<BearinxListValue[]> {
    if (url.endsWith(environment.preflightPath)) {
      return this.preflight(values);
    }

    // TODO: check lint rules
    // eslint-disable-next-line unicorn/no-array-reduce
    const requestUrl = values.reduce(
      (filledUrl, { name, value }) =>
        filledUrl.replace(`<${name}>`, `${value}`),
      url
    );

    return this.restService.getLoadOptions(requestUrl).pipe(
      map((response) => {
        if (isComplex(response)) {
          return response.data.bearingSeats.map(
            ({ _media, data: { id, title } }) => ({
              id,
              title,
              image: _media[0].href,
            })
          );
        }
        if (isSimple(response)) {
          return response.data.map(({ _media, data }) => ({
            image: _media ? _media[0]?.href : undefined,
            ...data,
          }));
        }

        return response.data;
      }),
      map((items) =>
        items.map(({ id, title, image }) => ({
          id,
          text: title,
          imageUrl: image ?? undefined,
        }))
      )
    );
  }

  private preflight(
    values: { name: string; value: string | number }[]
  ): Observable<BearinxListValue[]> {
    // TODO: check lint rules
    // eslint-disable-next-line unicorn/no-array-reduce
    const postData = values.reduce(
      (data, { name, value }) => ({
        ...data,
        [name === RSY_BEARING ? IDCO_DESIGNATION : name]: value,
      }),
      {}
    );

    return this.restService
      .getBearingPreflightResponse(postData as PreflightRequestBody)
      .pipe(
        map(({ data: { input } }) => {
          // TODO reduce code reuse between this and runtime requester
          // TODO: check lint rules
          // eslint-disable-next-line unicorn/no-array-reduce
          const allFields: MMBearingPreflightField[] = input.reduce(
            (inputs, { fields }) => [...inputs, ...fields],
            []
          );

          const nutField = allFields.find(
            ({ id }) => id === IDMM_HYDRAULIC_NUT_TYPE
          );

          if (!nutField || !nutField.range) {
            throw new Error(`Cannot find ${IDMM_HYDRAULIC_NUT_TYPE} field`);
          }

          return nutField.range.map(({ id, title: text }) => ({ id, text }));
        })
      );
  }
}
