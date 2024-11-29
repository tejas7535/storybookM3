import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { map, Observable, of } from 'rxjs';

import { EnvironmentEnum } from '../models';
import { getEnv } from './../../../environments/environments.provider';

@Injectable({
  providedIn: 'root',
})
export class ProdGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(): Observable<boolean> {
    return this.checkCondition().pipe(
      map((canActivate) => {
        if (!canActivate) {
          this.router.navigate(['/empty-states']);
        }

        return canActivate;
      })
    );
  }

  checkCondition(): Observable<boolean> {
    return of(getEnv().environment !== EnvironmentEnum.prod);
  }
}
