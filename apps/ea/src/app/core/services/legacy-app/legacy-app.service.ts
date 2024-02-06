import { Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { ProductSelectionFacade } from '@ea/core/store/facades';
import { environment } from '@ea/environments/environment';
import { getLocaleForLanguage } from '@ea/shared/constants/language';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

@Injectable({ providedIn: 'root' })
export class LegacyAppService {
  public legacyAppUrl$: Observable<string> = combineLatest([
    this.translocoService.langChanges$,
    this.productSelectionFacade.bearingId$,
    this.localeService.localeChanges$,
  ]).pipe(
    map(([language, bearingId, localeChanges]) => {
      const localization = getLocaleForLanguage(localeChanges);
      const decimalSign = localization.id === 'de-DE' ? 'comma' : 'dot';

      return `${environment.oldUIFallbackUrl}${bearingId}/${language}/${decimalSign}/metric/true`;
    })
  );

  constructor(
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly translocoService: TranslocoService,
    private readonly localeService: TranslocoLocaleService
  ) {}
}
