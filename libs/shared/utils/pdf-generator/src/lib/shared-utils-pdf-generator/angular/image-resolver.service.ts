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

  /**
   * Loads an image from assets directory and converts it to base64 data URL
   * @param assetPath - Path to the asset (e.g., '/assets/images/logo.png')
   * @returns Observable<string> - Base64 data URL
   */
  public readImageFromAssets(assetPath: string): Observable<string> {
    return this.httpClient
      .get(assetPath, { responseType: 'blob' })
      .pipe(switchMap((blob) => this.readBlob(blob)));
  }

  /**
   * Converts a Blob to base64 data URL
   * @param blob - The blob to convert
   * @returns Observable<string> - Base64 data URL
   */
  private readBlob(blob: Blob): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        observer.next(reader.result?.toString() || '');
        observer.complete();
      };
      reader.addEventListener('error', (error) => observer.error(error));
      reader.readAsDataURL(blob);
    });
  }
}
