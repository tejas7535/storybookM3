import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { DetailViewQueryParams } from '../app-routing.module';
import {
  getCustomer,
  getCustomerLoading,
  getQuotationLoading,
  getSelectedQuotationDetailItemId,
} from '../core/store';
import { Customer } from '../shared/models/customer';
import { BreadcrumbsService } from '../shared/services/breadcrumbs-service/breadcrumbs.service';

@Component({
  selector: 'gq-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
})
export class CustomerViewComponent implements OnInit {
  public selectedQuotationDetailItemId$: Observable<number>;
  public customer$: Observable<Customer>;
  public quotationLoading$: Observable<boolean>;
  public customerLoading$: Observable<boolean>;
  public breadcrumbs$: Observable<Breadcrumb[]>;
  public params$: Observable<DetailViewQueryParams>;

  public constructor(
    private readonly store: Store,
    private readonly router: ActivatedRoute,
    private readonly breadCrumbsService: BreadcrumbsService
  ) {}

  public ngOnInit(): void {
    this.selectedQuotationDetailItemId$ = this.store.select(
      getSelectedQuotationDetailItemId
    );
    this.customer$ = this.store.select(getCustomer);
    this.quotationLoading$ = this.store.select(getQuotationLoading);
    this.customerLoading$ = this.store.select(getCustomerLoading);
    this.params$ = this.router.queryParams.pipe(
      map((params) => params as DetailViewQueryParams)
    );
    this.breadcrumbs$ = combineLatest([
      this.selectedQuotationDetailItemId$,
      this.customer$,
      this.params$,
    ]).pipe(
      map(([id, customer, params]: [number, Customer, DetailViewQueryParams]) =>
        this.breadCrumbsService.getCustomerBreadCrumbs(params, customer, id)
      )
    );
  }
}
