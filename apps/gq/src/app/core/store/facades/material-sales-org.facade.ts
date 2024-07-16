import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { Store } from '@ngrx/store';

import {
  getMaterialSalesOrg,
  getMaterialSalesOrgDataAvailable,
  getMaterialSalesOrgLoading,
} from '../selectors/material-sales-org/material-sales-org.selector';

@Injectable({
  providedIn: 'root',
})
export class MaterialSalesOrgFacade {
  private readonly store: Store = inject(Store);

  materialSalesOrgLoading$: Observable<boolean> = this.store.select(
    getMaterialSalesOrgLoading
  );

  materialSalesOrg$: Observable<MaterialSalesOrg> =
    this.store.select(getMaterialSalesOrg);

  materialSalesOrgDataAvailable$: Observable<boolean> = this.store.select(
    getMaterialSalesOrgDataAvailable
  );
}
