import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getCustomerDetails,
  getDimensionAndWeightDetails,
  getPriceDetails,
  getProductionDetails,
  getQuantitiesDetails,
  getReferenceTypeLoading,
  getSalesDetails,
} from '../../core/store';
import { CustomerDetails } from './customer/model/customer.details.model';
import { DimensionAndWeightDetails } from './dimension-and-weight/model/dimension-and-weight-details.model';
import { PriceDetails } from './pricing/model/price.details.model';
import { ProductionDetails } from './production/model/production.details.model';
import { QuantitiesDetails } from './quantities/model/quantities.model';
import { SalesDetails } from './sales-and-description/model/sales-details.model';

@Component({
  selector: 'cdba-detail-tab',
  templateUrl: './detail-tab.component.html',
})
export class DetailTabComponent implements OnInit {
  isLoading$: Observable<boolean>;

  customerDetails$: Observable<CustomerDetails>;
  dimensionAndWeight$: Observable<DimensionAndWeightDetails>;
  salesPrice$: Observable<PriceDetails>;
  productionDetails$: Observable<ProductionDetails>;
  quantitiesDetails$: Observable<QuantitiesDetails>;
  salesDetails$: Observable<SalesDetails>;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getReferenceTypeLoading);

    this.customerDetails$ = this.store.select(getCustomerDetails);
    this.dimensionAndWeight$ = this.store.select(getDimensionAndWeightDetails);
    this.salesPrice$ = this.store.select(getPriceDetails);
    this.productionDetails$ = this.store.select(getProductionDetails);
    this.quantitiesDetails$ = this.store.select(getQuantitiesDetails);
    this.salesDetails$ = this.store.select(getSalesDetails);
  }
}
