import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getCustomerDetails,
  getDimensionAndWeightDetails,
  getPriceDetails,
  getProductionDetails,
  getQuantitiesDetails,
  getReferenceTypeErrorMessage,
  getReferenceTypeLoading,
  getSalesDetails,
} from '../../core/store';
import { DetailState } from '../../core/store/reducers/detail/detail.reducer';
import { CustomerDetails } from './customer/model/customer.details.model';
import { DimensionAndWeightDetails } from './dimension-and-weight/model/dimension-and-weight-details.model';
import { PriceDetails } from './pricing/model/price.details.model';
import { ProductionDetails } from './production/model/production.details.model';
import { QuantitiesDetails } from './quantities/model/quantities.model';
import { SalesDetails } from './sales-and-description/model/sales-details.model';

@Component({
  selector: 'cdba-detail-tab',
  templateUrl: './detail-tab.component.html',
  styleUrls: ['./detail-tab.component.scss'],
})
export class DetailTabComponent implements OnInit {
  isLoading$: Observable<boolean>;
  errorMessageDetails$: Observable<string>;

  customerDetails$: Observable<CustomerDetails>;
  dimensionAndWeight$: Observable<DimensionAndWeightDetails>;
  salesPrice$: Observable<PriceDetails>;
  productionDetails$: Observable<ProductionDetails>;
  quantitiesDetails$: Observable<QuantitiesDetails>;
  salesDetails$: Observable<SalesDetails>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(getReferenceTypeLoading));
    this.errorMessageDetails$ = this.store.pipe(
      select(getReferenceTypeErrorMessage)
    );

    this.customerDetails$ = this.store.pipe(select(getCustomerDetails));
    this.dimensionAndWeight$ = this.store.pipe(
      select(getDimensionAndWeightDetails)
    );
    this.salesPrice$ = this.store.pipe(select(getPriceDetails));
    this.productionDetails$ = this.store.pipe(select(getProductionDetails));
    this.quantitiesDetails$ = this.store.pipe(select(getQuantitiesDetails));
    this.salesDetails$ = this.store.pipe(select(getSalesDetails));
  }
}
