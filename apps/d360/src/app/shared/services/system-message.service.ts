import { HttpClient } from '@angular/common/http';
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import {
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';

import { translate } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { getBackendRoles } from '@schaeffler/azure-auth';

import { SystemMessageSettings } from '../models/user-settings.model';
import { adminsOnly, checkRoles } from '../utils/auth/roles';
import { SnackbarService } from '../utils/service/snackbar.service';

@Injectable({ providedIn: 'root' })
export class SystemMessageService {
  private readonly API = 'api/system-message';
  private readonly http: HttpClient = inject(HttpClient);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  private readonly backendRoles = toSignal(this.store.select(getBackendRoles));
  private readonly authorizedToChange = computed(() =>
    this.backendRoles() ? checkRoles(this.backendRoles(), adminsOnly) : false
  );

  public loading = signal<boolean>(false);

  public get$(): Observable<SystemMessageSettings | null> {
    if (!this.authorizedToChange()) {
      return of(null);
    }

    this.loading.set(true);

    return this.http
      .get<SystemMessageSettings | null>(this.API, { responseType: 'json' })
      .pipe(
        map((response: SystemMessageSettings | null) => response),
        catchError(() => {
          this.snackbarService.error(translate('error.loading_failed'));

          return of(null);
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      );
  }

  public put$(message: SystemMessageSettings): Observable<void> {
    if (!this.authorizedToChange()) {
      return EMPTY;
    }

    this.loading.set(true);

    return this.http.put<SystemMessageSettings>(this.API, message).pipe(
      take(1),
      switchMap(() => {
        this.snackbarService.success(translate('banner.saved'));

        return EMPTY;
      }),
      catchError(() => {
        this.snackbarService.error(translate('error.save.failed'));

        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
