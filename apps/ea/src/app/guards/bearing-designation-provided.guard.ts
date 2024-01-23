import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { combineLatest, map } from 'rxjs';

import { AppRoutePath } from '@ea/app-route-path.enum';
import { ProductSelectionFacade, SettingsFacade } from '@ea/core/store';

@Injectable({
  providedIn: 'root',
})
export class BearingDesignationProvidedGuard {
  constructor(
    private readonly router: Router,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly settingsFacade: SettingsFacade
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const { queryParams } = route;

    return combineLatest([
      this.productSelectionFacade.bearingDesignation$,
      this.settingsFacade.isStandalone$,
    ]).pipe(
      map(([bearingDesignation, isStandalone]) => {
        if (bearingDesignation || !isStandalone) {
          return true;
        }

        this.router.navigate([AppRoutePath.HomePath], { queryParams });

        return false;
      })
    );
  }
}
