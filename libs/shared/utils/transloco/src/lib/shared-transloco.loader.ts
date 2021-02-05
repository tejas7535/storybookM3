import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  Translation,
  TRANSLOCO_LOADER,
  TranslocoLoader,
} from '@ngneat/transloco';

import { I18N_CACHE_CHECKSUM } from './injection-tokens';

@Injectable({ providedIn: 'root' })
export class SharedHttpLoader implements TranslocoLoader {
  constructor(
    private readonly http: HttpClient,
    @Inject(I18N_CACHE_CHECKSUM)
    private readonly cacheChecksum: any
  ) {}

  public getTranslation(langPath: string): Observable<Translation> {
    let path = `/assets/i18n/${langPath}.json`;
    path += this.cacheChecksum?.[langPath]
      ? `?v=${this.cacheChecksum[langPath]}`
      : '';

    return this.http.get<Translation>(path);
  }
}

export const sharedTranslocoLoader = {
  provide: TRANSLOCO_LOADER,
  useClass: SharedHttpLoader,
};
