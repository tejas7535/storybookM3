import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { map } from 'rxjs';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { SettingsFacade } from '@ga/core/store';
import { GreaseCalculationPath } from '@ga/grease-calculation/grease-calculation-path.enum';

@Injectable({
  providedIn: 'root',
})
export class AppIsEmbeddedGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly settingsFacade: SettingsFacade
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const { queryParams } = route;

    return this.settingsFacade.appIsEmbedded$.pipe(
      map((isEmbedded) => {
        if (isEmbedded) {
          this.router.navigate(
            [
              AppRoutePath.GreaseCalculationPath,
              GreaseCalculationPath.ParametersPath,
            ],
            { queryParams }
          );

          return false;
        }

        return true;
      })
    );
  }
}
