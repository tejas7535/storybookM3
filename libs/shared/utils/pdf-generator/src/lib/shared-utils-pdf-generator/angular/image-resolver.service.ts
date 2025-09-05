/* eslint-disable unicorn/number-literal-case */
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
  public constructor(private readonly httpClient: HttpClient) {}

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
          switchMap((loadEvent) => {
            const results = (loadEvent.target as FileReader).result as string;

            return this.processImageData(results).pipe(
              map((processedResults) => {
                const returnResult: T = {
                  ...data,
                };
                returnResult[urlKey] = processedResults as unknown as T[K]; // appease the mighty type checker

                return returnResult;
              })
            );
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
    return this.httpClient.get(assetPath, { responseType: 'blob' }).pipe(
      switchMap((blob) => this.readBlob(blob)),
      switchMap((base64) => this.processImageData(base64))
    );
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

  /**
   * Processes image data to handle 16-bit PNG compatibility with jsPDF 3.0.2+
   * Converts 16-bit PNG images to 8-bit using canvas rendering
   * @param base64Data - Base64 data URL of the image
   * @returns Observable<string> - Processed base64 data URL
   */
  private processImageData(base64Data: string): Observable<string> {
    return new Observable<string>((observer) => {
      // Only process PNG images
      if (!base64Data.startsWith('data:image/png')) {
        observer.next(base64Data);
        observer.complete();

        return;
      }

      // Check if the PNG is 16-bit
      if (!this.is16BitPng(base64Data)) {
        observer.next(base64Data);
        observer.complete();

        return;
      }

      // Convert 16-bit PNG to 8-bit using canvas
      this.convertTo8BitPng(base64Data)
        .then((convertedData) => {
          observer.next(convertedData);
          observer.complete();
        })
        .catch((error) => {
          // If conversion fails, fallback to original data
          console.warn(
            'Failed to convert 16-bit PNG to 8-bit, using original:',
            error
          );
          observer.next(base64Data);
          observer.complete();
        });
    });
  }

  /**
   * Checks if a PNG image is 16-bit by examining the IHDR chunk
   * @param base64Data - Base64 data URL of the PNG image
   * @returns boolean - True if the PNG is 16-bit
   */
  private is16BitPng(base64Data: string): boolean {
    try {
      // Extract base64 data without the data URL prefix
      const base64Content = base64Data.split(',')[1];
      const binaryString = atob(base64Content);

      // Convert to Uint8Array for easier byte manipulation
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i += 1) {
        bytes[i] = binaryString.codePointAt(i) || 0;
      }

      // PNG signature: 89 50 4E 47 0D 0A 1A 0A
      if (
        bytes.length < 8 ||
        bytes[0] !== 0x89 ||
        bytes[1] !== 0x50 ||
        bytes[2] !== 0x4e ||
        bytes[3] !== 0x47 ||
        bytes[4] !== 0x0d ||
        bytes[5] !== 0x0a ||
        bytes[6] !== 0x1a ||
        bytes[7] !== 0x0a
      ) {
        return false;
      }

      // IHDR chunk starts at byte 8
      // Skip chunk length (4 bytes) and chunk type "IHDR" (4 bytes)
      const ihdrStart = 16;

      if (bytes.length < ihdrStart + 9) {
        return false;
      }

      // Bit depth is at byte 24 (ihdrStart + 8)
      const bitDepth = bytes[ihdrStart + 8];

      return bitDepth === 16;
    } catch (error) {
      console.warn('Error checking PNG bit depth:', error);

      return false;
    }
  }

  /**
   * Converts a 16-bit PNG to 8-bit using canvas rendering
   * @param base64Data - Base64 data URL of the 16-bit PNG
   * @returns Promise<string> - Base64 data URL of the converted 8-bit PNG
   */
  private convertTo8BitPng(base64Data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.addEventListener('load', () => {
        try {
          // Create canvas with same dimensions as image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get canvas context'));

            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image to canvas (this automatically converts to 8-bit)
          ctx.drawImage(img, 0, 0);

          // Convert canvas to 8-bit PNG
          const convertedBase64 = canvas.toDataURL('image/png');

          resolve(convertedBase64);
        } catch (error) {
          reject(error);
        }
      });

      img.addEventListener('error', () => {
        reject(new Error('Failed to load image for conversion'));
      });

      // Load the image
      img.src = base64Data;
    });
  }
}
