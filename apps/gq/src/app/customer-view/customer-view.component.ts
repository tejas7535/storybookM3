import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { combineLatest, Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { DetailViewQueryParams } from '../app-routing.module';
import {
  getCustomer,
  getSelectedQuotationDetailItemId,
  isCustomerLoading,
  isQuotationLoading,
} from '../core/store';
import { Customer } from '../shared/models/customer';
import { BreadcrumbsService } from '../shared/services/breadcrumbs-service/breadcrumbs.service';

@Component({
  selector: 'gq-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
})
export class CustomerViewComponent implements OnInit, OnDestroy {
  public getSelectedQuotationDetailItemIdSubscription$: Observable<number>;
  public customer$: Observable<Customer>;
  public quotationLoading$: Observable<boolean>;
  public isCustomerLoading$: Observable<boolean>;
  public breadcrumbs: Breadcrumb[];
  public params: DetailViewQueryParams;

  private readonly subscription: Subscription = new Subscription();

  public constructor(
    private readonly store: Store,
    private readonly router: ActivatedRoute,
    private readonly breadCrumbsService: BreadcrumbsService
  ) {}

  public ngOnInit(): void {
    this.getSelectedQuotationDetailItemIdSubscription$ = this.store.select(
      getSelectedQuotationDetailItemId
    );
    this.customer$ = this.store.select(getCustomer);
    this.quotationLoading$ = this.store.select(isQuotationLoading);
    this.isCustomerLoading$ = this.store.select(isCustomerLoading);

    this.addSubscriptions();
  }

  public addSubscriptions(): void {
    this.addQueryParamsSubscription();
    this.addGetSelectedQuotationDetailItemIdSubscription();
  }

  public addQueryParamsSubscription(): void {
    this.subscription.add(
      this.router.queryParams.subscribe(
        (params: Params) => (this.params = params as DetailViewQueryParams)
      )
    );
  }

  public addGetSelectedQuotationDetailItemIdSubscription(): void {
    const subscription = combineLatest(
      this.getSelectedQuotationDetailItemIdSubscription$,
      this.customer$
    ).subscribe(([id, customer]: [number, Customer]) => {
      this.breadcrumbs = this.breadCrumbsService.getCustomerBreadCrumbs(
        this.params,
        customer,
        id
      );
    });

    this.subscription.add(subscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
