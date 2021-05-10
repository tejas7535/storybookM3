import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BearinxListValue, LazyListLoader } from '@caeonline/dynamic-forms';
import { withCache } from '@ngneat/cashew';

import { environment } from '../../environments/environment';
import {
  IDCO_DESIGNATION,
  IDMM_HYDRAULIC_NUT_TYPE,
  RSY_BEARING,
} from '../shared/constants/dialog-constant';

interface MMResponse {
  id: string;
  title: string;
  image?: string | null;
}

interface MMBaseResponse {
  data: MMResponse[];
}

interface MMSimpleResponse {
  data: { data: MMResponse; _media?: [{ href: string }] }[];
}

interface MMComplexResponse {
  data: {
    bearingSeats: {
      data: {
        id: string;
        title: string;
      };
      _media: [{ href: string }];
    }[];
  };
}

type MMResponseVariants = MMBaseResponse | MMSimpleResponse | MMComplexResponse;

export interface MMBearingPreflightField {
  id: string;
  range: { id: string; title: string }[] | null;
  defaultValue: string;
}

export interface MMBearingPreflightResponse {
  data: {
    input: {
      id: string;
      title: string;
      fields: MMBearingPreflightField[];
    }[];
  };
}

export interface MMBearingsMaterialResponse {
  id: string;
  IDMM_MODULUS_OF_ELASTICITY: string;
  IDMM_POISSON_RATIO: string;
}

const isComplex = (
  response: MMResponseVariants
): response is MMComplexResponse => !Array.isArray(response.data);

const isSimple = (response: MMResponseVariants): response is MMSimpleResponse =>
  !isComplex(response) && 'data' in response.data[0];

@Injectable()
export class LazyListLoaderService implements LazyListLoader {
  constructor(private readonly http: HttpClient) {}

  public loadOptions(
    url: string,
    values: { name: string; value: string | number }[]
  ): Observable<BearinxListValue[]> {
    if (url.endsWith(environment.preflightPath)) {
      return this.preflight(url, values);
    }

    const requestUrl = values.reduce(
      (filledUrl, { name, value }) =>
        filledUrl.replace(`<${name}>`, `${value}`),
      url
    );

    return this.http.get<MMResponseVariants>(requestUrl, withCache()).pipe(
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
            image: _media ? _media[0].href : undefined,
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
    url: string,
    values: { name: string; value: string | number }[]
  ): Observable<BearinxListValue[]> {
    const postData = values.reduce(
      (data, { name, value }) => ({
        ...data,
        [name === RSY_BEARING ? IDCO_DESIGNATION : name]: value,
      }),
      {}
    );

    return this.http.post<MMBearingPreflightResponse>(url, postData).pipe(
      map(({ data: { input } }) => {
        // TODO reduce code reuse between this and runtime requester
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
