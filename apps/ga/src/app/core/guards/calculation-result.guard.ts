// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../app-route-path.enum';
import { GreaseCalculationPath } from '../../features/grease-calculation/grease-calculation-path.enum';
import { getParameterValidity } from '../store/selectors/calculation-parameters/calculation-parameters.selector';

@Injectable()
export class CalculationResultGuard {
  constructor(
    public readonly store: Store,
    public readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { queryParams } = route;

    return this.store.select(getParameterValidity).pipe(
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map((valid) => {
        if (!valid) {
          this.router.navigate(
            [
              `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
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
