import { Injectable } from '@angular/core';

import { combineLatest, map } from 'rxjs';

import {
  userHasGPCRole,
  userHasManualPriceRole,
  userHasRegionAmericasRole,
  userHasRegionGreaterChinaRole,
  userHasRegionWorldRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

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
      !hasRegionGreaterChina ? true : hasGPC && hasSQV
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

  constructor(private readonly store: Store) {}
}
