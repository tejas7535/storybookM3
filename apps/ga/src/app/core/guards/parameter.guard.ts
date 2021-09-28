// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../app-route-path.enum';
import { GreaseCalculationPath } from '../../grease-calculation/grease-calculation-path.enum';
import { getSelectedBearing } from '../store/selectors/bearing/bearing.selector';

@Injectable()
export class ParameterGuard implements CanActivate {
  constructor(public readonly store: Store, public readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { queryParams } = route;

    return this.store.select(getSelectedBearing).pipe(
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map((bearing) => {
        if (!bearing && !queryParams.bearing) {
          this.router.navigate(
            [
              `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.BearingPath}`,
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
