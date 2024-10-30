import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { from, Observable, of, switchMap } from 'rxjs';

import { AppRoutePath } from '../../../app.routes.enum';
import { AuthService } from './auth.service';
import { Role } from './roles';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    const allowedRoles: Role[] = route.data['allowedRoles'] || [];

    return this.authService.hasUserAccess(allowedRoles).pipe(
      switchMap((hasAccess) => {
        if (hasAccess) {
          return of(true);
        }

        return from(this.router.navigate([AppRoutePath.ForbiddenPath]));
      })
    );
  }
}
