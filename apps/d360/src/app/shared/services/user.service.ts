import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { catchError, map, Observable, of, switchMap, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { CustomRoute } from '../../app.routes';
import { AppRoutePath, AppRouteValue } from '../../app.routes.enum';
import { Region } from '../../feature/global-selection/model';
import { AuthService } from '../utils/auth/auth.service';
import { checkRoles } from '../utils/auth/roles';
import { SnackbarService } from '../utils/service/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_REGION_API = 'api/user/region';
  private readonly http: HttpClient = inject(HttpClient);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly START_PAGE_API = 'api/user-settings/general';

  private readonly userRoles = toSignal(this.authService.getUserRoles());

  public readonly startPage = signal<AppRouteValue>(null);

  public readonly region = signal<Region>(null);

  public constructor() {
    this.loadRegion().pipe(take(1), takeUntilDestroyed()).subscribe();
    this.getStartPage().pipe(take(1), takeUntilDestroyed()).subscribe();
  }

  public loadRegion() {
    if (localStorage.getItem('region')) {
      this.region.set(localStorage.getItem('region') as Region);

      return of(localStorage.getItem('region') as Region);
    } else {
      return this.http
        .get(this.USER_REGION_API, {
          responseType: 'text',
        })
        .pipe(
          catchError(() => {
            this.snackbarService.openSnackBar(
              translate('error.loadingConfigurationFailed')
            );

            return of(null);
          }),
          take(1),
          map((value) => {
            this.region.set(value as Region);
            localStorage.setItem('region', value);

            return value as Region;
          }),
          takeUntilDestroyed(this.destroyRef)
        );
    }
  }

  public filterVisibleRoutes(routes: CustomRoute[]) {
    // The function menu entries can be hidden in three different ways:
    // 1. have a false visible attribute
    // 2. the user is not located in one of the allowedRegions
    // 3. the user lacks all the permissions that are set in the allowedRoles attribute
    const visibilityFilter = (route: CustomRoute) =>
      (route.visible === undefined || route.visible) &&
      (route.data?.allowedRegions === undefined ||
        (this.region() &&
          route.data?.allowedRegions.includes(this.region()))) &&
      (!route.data?.allowedRoles ||
        checkRoles(this.userRoles() || [], route.data?.allowedRoles));

    return routes?.filter((element) => visibilityFilter(element));
  }

  public saveStartPage(startPage: AppRouteValue) {
    return this.http.post(this.START_PAGE_API, { startPage }).pipe(
      tap(() => {
        this.startPage.set(startPage);
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private loadStartPage(): Observable<AppRouteValue> {
    return this.http.get<Record<string, any>>(this.START_PAGE_API).pipe(
      map((result) => result && (result?.startPage as AppRouteValue)),
      catchError(() => of(null)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  /*
   * Returns the start-page after the necessary data is loaded from the backend.
   * If the user has configured a start-page this is returned
   * Otherwise the default startpage for the corresponding region is returned.
   */
  public getStartPage() {
    return this.loadStartPage().pipe(
      switchMap((startPage) => {
        if (startPage) {
          this.startPage.set(startPage);

          return of(startPage);
        } else {
          return this.loadRegion().pipe(
            map((region) => {
              const fallBackPage =
                region === Region.Europe
                  ? AppRoutePath.OverviewPage
                  : AppRoutePath.CustomerMaterialDetailsPage;
              this.startPage.set(fallBackPage);

              return fallBackPage;
            })
          );
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
