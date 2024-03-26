import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';

import { AppRoutePath } from '@hc/app-route-path.enum';
import { environment } from '@hc/environments/environment';

import { AvailabilityData } from '../../../models/availability-data.model';

@Injectable({
  providedIn: 'root',
})
export class AvailabityGuard {
  private readonly BASE_URL = `${environment.baseUrl}`;
  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {}

  canActivate(route: ActivatedRouteSnapshot, _state?: RouterStateSnapshot) {
    const { path, availabilityCheckUrl, isEmptyState }: AvailabilityData =
      route.data.availabilityCheck;

    return this.http
      .get<any>(`${this.BASE_URL}${availabilityCheckUrl}`, {
        observe: 'response',
      })
      .pipe(
        take(1),
        tap((response) => {
          if (isEmptyState && response.ok) {
            this.router.navigate([`/${path}`]);
          }
        }),
        map(() => true),
        catchError(() => {
          if (!isEmptyState) {
            this.router.navigate([`/${AppRoutePath.Maintenance}`]);
          }

          return of(true);
        })
      );
  }
}
