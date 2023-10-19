import { Injectable } from '@angular/core';

import { combineLatest, map } from 'rxjs';

import {
  userHasGPCRole,
  userHasManualPriceRole,
  userHasRegionGreaterChinaRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

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

  constructor(private readonly store: Store) {}
}
