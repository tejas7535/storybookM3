import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ListValue } from '@mm/shared/models/lazy-list-loader/mm-list-value.model';

import { environment } from '../../../../environments/environment';
import {
  MMComplexResponse,
  MMResponseVariants,
  MMSimpleResponse,
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
export class LazyListLoaderService {
  public baseImageURL = environment.baseUrl.replace('/v1', '');

  public constructor(private readonly restService: RestService) {}

  public loadOptions(
    url: string,
    values: { name: string; value: string | number }[]
  ): Observable<ListValue[]> {
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
              image: this.getImageUrl(_media[0].href),
            })
          );
        }
        if (isSimple(response)) {
          return response.data.map(({ _media, data }) => ({
            image: _media ? this.getImageUrl(_media[0]?.href) : undefined,
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

  private getImageUrl(wrongImageUrl: string): string {
    const fileName = this.extractFilename(wrongImageUrl);

    return `${this.baseImageURL}/Images/${fileName}`;
  }

  private extractFilename(url: string): string {
    const filename = url.slice(Math.max(0, url.lastIndexOf('/') + 1));

    return filename;
  }
}
