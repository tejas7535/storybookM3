import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';

import { RoleFacade } from '../../role-facade/role.facade';

@Injectable({
  providedIn: 'root',
})
export class DescriptiveRoleGuard {
  constructor(
    private readonly router: Router,
    private readonly roleFacade: RoleFacade
  ) {}

  canActivate() {
    return this.hasDescriptiveRoles();
  }

  canActivateChild() {
    return this.hasDescriptiveRoles();
  }

  private hasDescriptiveRoles() {
    return this.roleFacade.hasDescriptiveRoles$.pipe(
      tap(async (hasDescriptiveRoles) => {
        if (!hasDescriptiveRoles) {
          await this.router.navigate([
            AppRoutePath.EmptyStatesPath,
            EmptyStatesPath.MissingRolesPath,
          ]);
        }
      })
    );
  }
}
