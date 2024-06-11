import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard {
  constructor(private readonly translocoService: TranslocoService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const { queryParams } = route;
    const pathLanguage = route.paramMap.get('language');
    if (pathLanguage && this.translocoService.isLang(pathLanguage)) {
      this.translocoService.setActiveLang(pathLanguage);

      return true;
    }

    const language = queryParams?.language;
    if (language && this.translocoService.isLang(language)) {
      this.translocoService.setActiveLang(language);
    }

    return true;
  }
}
