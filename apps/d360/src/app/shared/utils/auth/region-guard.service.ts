import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { map } from 'rxjs';

import { AppRoutePath } from '../../../app.routes.enum';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RegionGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  public canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ) {
    const allowedRegions = route.routeConfig.data?.allowedRegions;

    return this.userService.loadRegion().pipe(
      map(
        (region) =>
          allowedRegions === undefined ||
          allowedRegions?.includes(region) ||
          this.router.parseUrl(AppRoutePath.ForbiddenPage)
      ),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
