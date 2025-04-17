import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  concatMap,
  from,
  fromEvent,
  map,
  Observable,
  switchMap,
  take,
  toArray,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageResolverService {
  constructor(private readonly httpClient: HttpClient) {}

  public fetchImageObject<T, K extends Extract<keyof T, string>>(
    data: T,
    urlKey: K
  ): Observable<T> {
    const url = data[urlKey] as string;

    return this.httpClient.get(url, { responseType: 'blob' as 'json' }).pipe(
      switchMap((blob) => {
        const reader = new FileReader();
        const event = fromEvent(reader, 'loadend');

        reader.readAsDataURL(blob as Blob);

        return event.pipe(
          take(1),
          map((loadEvent) => {
            const results = (loadEvent.target as FileReader).result as string;
            const returnResult: T = {
              ...data,
            };
            returnResult[urlKey] = results as unknown as T[K]; // appease the mighty type checker

            return returnResult;
          })
        );
      })
    );
  }

  public fetchImages<T, K extends Extract<keyof T, string>>(
    data: T[],
    urlKey: K
  ) {
    return from(data).pipe(
      concatMap((item) => this.fetchImageObject(item, urlKey)),
      toArray()
    );
  }
}
