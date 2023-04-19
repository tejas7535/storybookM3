import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { TranslocoService } from '@ngneat/transloco';

import { isLanguageAvailable } from '@ga/core/helpers/language-helpers';

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard implements CanActivate {
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
