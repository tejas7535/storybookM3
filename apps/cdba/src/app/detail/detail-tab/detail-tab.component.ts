import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  CustomerDetails,
  DimensionAndWeightDetails,
  PriceDetails,
  ProductionDetails,
  QuantitiesDetails,
  SalesDetails,
} from '@cdba/shared/models';

import {
  getCustomerDetails,
  getDimensionAndWeightDetails,
  getPriceDetails,
  getProductionDetails,
  getQuantitiesDetails,
  getReferenceTypeLoading,
  getSalesDetails,
} from '../../core/store';

@Component({
  selector: 'cdba-detail-tab',
  templateUrl: './detail-tab.component.html',
})
export class DetailTabComponent implements OnInit {
  isLoading$: Observable<boolean>;

  customerDetails$: Observable<CustomerDetails>;
  dimensionAndWeightDetails$: Observable<DimensionAndWeightDetails>;
  priceDetails$: Observable<PriceDetails>;
  productionDetails$: Observable<ProductionDetails>;
  quantitiesDetails$: Observable<QuantitiesDetails>;
  salesDetails$: Observable<SalesDetails>;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getReferenceTypeLoading);

    this.customerDetails$ = this.store.select(getCustomerDetails);
    this.dimensionAndWeightDetails$ = this.store.select(
      getDimensionAndWeightDetails
    );
    this.priceDetails$ = this.store.select(getPriceDetails);
    this.productionDetails$ = this.store.select(getProductionDetails);
    this.quantitiesDetails$ = this.store.select(getQuantitiesDetails);
    this.salesDetails$ = this.store.select(getSalesDetails);
  }
}
