import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly router: Router
  ) {}

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
      this.removeQueryParam(route, 'language');
    }

    return true;
  }

  private removeQueryParam(route: ActivatedRouteSnapshot, param: string): void {
    const queryParams = { ...route.queryParams };
    delete queryParams[param];

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
