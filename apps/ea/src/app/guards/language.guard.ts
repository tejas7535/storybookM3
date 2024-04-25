import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { isLanguageAvailable } from '@ea/shared/helper/language-helpers';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard {
  constructor(private readonly translocoService: TranslocoService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const { queryParams } = route;
    const language = queryParams?.language;
    if (isLanguageAvailable(language)) {
      this.translocoService.setActiveLang(language);
    }

    return true;
  }
}
