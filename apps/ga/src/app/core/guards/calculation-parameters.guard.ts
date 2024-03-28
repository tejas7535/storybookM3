// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../app-route-path.enum';
import { GreaseCalculationPath } from '../../features/grease-calculation/grease-calculation-path.enum';
import { getModelCreationSuccess } from '../store/selectors/bearing-selection/bearing-selection.selector';

@Injectable()
export class CalculationParametersGuard {
  constructor(
    public readonly store: Store,
    public readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { queryParams } = route;

    return this.store.select(getModelCreationSuccess).pipe(
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map((success: boolean) => {
        // TODO: handle queryParams that cannot create a model
        if (!success && !queryParams.bearing) {
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
