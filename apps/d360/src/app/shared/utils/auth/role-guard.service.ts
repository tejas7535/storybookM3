import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { from, Observable, of, switchMap } from 'rxjs';

import { AppRoutePath } from '../../../app.routes.enum';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService
      .hasUserAccess(route.data['allowedRoles'] || [])
      .pipe(
        switchMap((hasAccess) =>
          hasAccess
            ? of(true)
            : from(this.router.navigate([AppRoutePath.ForbiddenPath]))
        ),
        takeUntilDestroyed(this.destroyRef)
      );
  }
}
