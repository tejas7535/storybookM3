import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { map } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { isLanguageAvailable } from '@ga/core/helpers/language-helpers';
import { SettingsFacade } from '@ga/core/store';

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard implements CanActivate {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly settingsFacade: SettingsFacade
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const { queryParams } = route;
    const language = queryParams?.language;

    return this.settingsFacade.appIsEmbedded$.pipe(
      map((isEmbedded) => {
        if (isEmbedded && isLanguageAvailable(language)) {
          this.translocoService.setActiveLang(queryParams.language);
        }

        return true;
      })
    );
  }
}
