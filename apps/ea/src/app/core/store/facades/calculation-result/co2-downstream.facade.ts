import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { getDownstreamErrors } from '../../selectors/calculation-result/co2-downstream-calculation-result.selector';

@Injectable({ providedIn: 'root' })
export class Co2DownstreamFacade {
  public readonly downstreamErrors$ = this.store.select(getDownstreamErrors);

  constructor(private readonly store: Store) {}
}
