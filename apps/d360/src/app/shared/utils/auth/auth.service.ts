import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, of, switchMap } from 'rxjs';

import { Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { checkRoles, Role } from './roles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(Store);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public hasUserAccess(allowedRoles: Role[]): Observable<boolean> {
    return this.store.pipe(
      getRoles,
      switchMap((userRoles) => of(checkRoles(userRoles, allowedRoles))),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
