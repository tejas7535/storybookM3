import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
