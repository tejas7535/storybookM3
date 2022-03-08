import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { concatLatestFrom } from '@ngrx/effects';

import { AppRoutePath } from '../../../app-route-path.enum';
import { EmptyStatesPath } from '../../empty-states/empty-states-path.enum';
import { RoleFacade } from '../role.facade';

@Injectable({
  providedIn: 'root',
})
export class BasicRoleGuard implements CanActivateChild {
  constructor(
    private readonly router: Router,
    private readonly roleFacade: RoleFacade
  ) {}

  canActivateChild(): Observable<boolean> {
    return this.roleFacade.hasBasicRole$.pipe(
      concatLatestFrom(() => this.roleFacade.isLoggedIn$),
      filter(([_hasBasicRole, isLoggedIn]) => isLoggedIn),
      map(([hasBasicRole, _isLoggedIn]) => hasBasicRole),
      tap(async (hasBasicRole) => {
        if (!hasBasicRole) {
          await this.router.navigate([
            AppRoutePath.EmptyStatesPath,
            EmptyStatesPath.NoAccessPath,
          ]);
        }
      })
    );
  }
}
