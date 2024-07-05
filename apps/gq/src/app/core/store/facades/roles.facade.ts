import { Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import {
  userHasGPCRole,
  userHasManualPriceRole,
  userHasRegionAmericasRole,
  userHasRegionGreaterChinaRole,
  userHasRegionWorldRole,
  userHasRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { UserRoles } from '@gq/shared/constants';
import { Store } from '@ngrx/store';

import { getRoles, getUserUniqueIdentifier } from '@schaeffler/azure-auth';

@Injectable({
  providedIn: 'root',
})
export class RolesFacade {
  userHasManualPriceRole$ = this.store.pipe(userHasManualPriceRole);
  userHasGPCRole$ = this.store.pipe(userHasGPCRole);
  userHasSQVRole$ = this.store.pipe(userHasSQVRole);

  userHasRegionGreaterChinaRole$ = this.store.pipe(
    userHasRegionGreaterChinaRole
  );
  userHasRegionAmericasRole$ = this.store.pipe(userHasRegionAmericasRole);
  userHasRegionWorldRole$ = this.store.pipe(userHasRegionWorldRole);

  loggedInUserId$ = this.store.select(getUserUniqueIdentifier);

  /**
   * user of greater china can only see comparable transaction when they have GPC and SQV role
   */
  userHasAccessToComparableTransactions$ = combineLatest([
    this.userHasGPCRole$,
    this.userHasSQVRole$,
    this.userHasRegionGreaterChinaRole$,
  ]).pipe(
    map(([hasGPC, hasSQV, hasRegionGreaterChina]) =>
      hasRegionGreaterChina ? hasGPC && hasSQV : true
    )
  );

  userHasGeneralDeletePositionsRole$ = combineLatest([
    this.userHasRegionAmericasRole$,
    this.userHasRegionWorldRole$,
  ]).pipe(
    map(
      ([hasRegionAmericas, hasRegionWorld]) =>
        hasRegionAmericas || hasRegionWorld
    )
  );

  // if user has the regional role GREATER_CHINA, the role PRICE_MANUAL is needed in addition to be allowed to change the priceSource
  // see: https://confluence.schaeffler.com/display/PARS/Restrictions+for+User+Roles
  userHasEditPriceSourceRole$ = combineLatest([
    this.userHasRegionGreaterChinaRole$,
    this.userHasManualPriceRole$,
  ]).pipe(
    map(([hasRegionGreaterChina, hasManualPrice]) =>
      hasRegionGreaterChina ? hasManualPrice : true
    )
  );

  userHasRegionWorldOrGreaterChinaRole$ = combineLatest([
    this.userHasRegionGreaterChinaRole$,
    this.userHasRegionWorldRole$,
  ]).pipe(
    map(
      ([hasRegionGreaterChina, hasRegionWorld]) =>
        hasRegionGreaterChina || hasRegionWorld
    )
  );

  constructor(private readonly store: Store) {}

  userHasRole$(role: UserRoles): Observable<boolean> {
    return this.store.pipe(userHasRole(role));
  }

  userHasRoles$(roles: UserRoles[]): Observable<boolean> {
    return this.store
      .pipe(getRoles)
      .pipe(
        map((rolesFromStore) =>
          roles.every((role) => rolesFromStore.includes(role))
        )
      );
  }
}
