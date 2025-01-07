import { map, Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

export interface TranslationItem<T> {
  key: string;
  value: T;
}

export function createTranslationObservables<T>(
  translocoService: TranslocoService,
  baseKey: string,
  items: TranslationItem<T>[]
): Observable<{ label: string; value: T }>[] {
  return items.map((item) =>
    translocoService.selectTranslate(`${baseKey}${item.key}`).pipe(
      map((label) => ({
        label,
        value: item.value,
      }))
    )
  );
}
