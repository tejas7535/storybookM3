import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  Translation,
  TRANSLOCO_LOADER,
  TranslocoLoader,
} from '@jsverse/transloco';

import { I18N_CACHE_CHECKSUM, LOADER_PATH } from './injection-tokens';

@Injectable({ providedIn: 'root' })
export class SharedHttpLoader implements TranslocoLoader {
  public constructor(
    private readonly http: HttpClient,
    @Inject(I18N_CACHE_CHECKSUM)
    private readonly cacheChecksum: any,
    @Inject(LOADER_PATH) private readonly loaderPath: string
  ) {}

  public getTranslation(langPath: string): Observable<Translation> {
    let path = `${this.loaderPath}${langPath}.json`;
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
