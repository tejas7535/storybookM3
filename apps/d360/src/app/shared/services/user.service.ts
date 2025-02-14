import { HttpClient } from '@angular/common/http';
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, map, of, take } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { AppRoutePath } from '../../app.routes.enum';
import { Region } from '../../feature/global-selection/model';
import { SnackbarService } from '../utils/service/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_REGION_API = 'api/user/region';
  private readonly http: HttpClient = inject(HttpClient);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  public startPage = computed(() =>
    this.region() === Region.Europe
      ? AppRoutePath.OverviewPage
      : AppRoutePath.CustomerMaterialDetailsPage
  );

  public readonly region = signal<Region>(null);

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
}
