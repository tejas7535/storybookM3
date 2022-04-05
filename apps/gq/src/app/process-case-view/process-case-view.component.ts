import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { getQuotation, updateCaseName } from '../core/store';
import {
  getGqId,
  getUpdateLoading,
  isCustomerLoading,
  isQuotationLoading,
} from '../core/store/selectors';
import { Quotation } from '../shared/models';
import { BreadcrumbsService } from '../shared/services/breadcrumbs-service/breadcrumbs.service';

@Component({
  selector: 'gq-case-view',
  templateUrl: './process-case-view.component.html',
})
export class ProcessCaseViewComponent implements OnInit, OnDestroy {
  public quotation$: Observable<Quotation>;
  public isCustomerLoading$: Observable<boolean>;
  public isQuotationLoading$: Observable<boolean>;
  public isUpdateLoading$: Observable<boolean>;
  public breadcrumbs: Breadcrumb[];
  public displayTitle = true;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService
  ) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.isCustomerLoading$ = this.store.select(isCustomerLoading);
    this.isQuotationLoading$ = this.store.select(isQuotationLoading);
    this.isUpdateLoading$ = this.store.select(getUpdateLoading);
    this.subscription.add(
      this.store
        .select(getGqId)
        .subscribe(
          (gqId) =>
            (this.breadcrumbs =
              this.breadCrumbsService.getQuotationBreadcrumbsForProcessCaseView(
                gqId
              ))
        )
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  public toggleDisplayTitle(display: boolean): void {
    this.displayTitle = display;
  }
  public updateCaseName(caseName: string): void {
    this.store.dispatch(updateCaseName({ caseName }));
  }
}
