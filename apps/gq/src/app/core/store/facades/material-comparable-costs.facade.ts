import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MaterialComparableCost } from '@gq/shared/models/quotation-detail/material-comparable-cost.model';
import { Store } from '@ngrx/store';

import {
  getMaterialComparableCosts,
  getMaterialComparableCostsLoading,
} from '../selectors/material-comparable-costs/material-comparable-costs.selector';

@Injectable({
  providedIn: 'root',
})
export class MaterialComparableCostsFacade {
  private readonly store: Store = inject(Store);

  materialComparableCostsLoading$: Observable<boolean> = this.store.select(
    getMaterialComparableCostsLoading
  );

  materialComparableCosts$: Observable<MaterialComparableCost[]> =
    this.store.select(getMaterialComparableCosts);
}
