import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { getQuotation, updateCaseName } from '../core/store';
import {
  getCustomerLoading,
  getGqId,
  getQuotationLoading,
  getUpdateLoading,
} from '../core/store/selectors';
import { Quotation } from '../shared/models';
import { BreadcrumbsService } from '../shared/services/breadcrumbs-service/breadcrumbs.service';

@Component({
  selector: 'gq-case-view',
  templateUrl: './process-case-view.component.html',
})
export class ProcessCaseViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public customerLoading$: Observable<boolean>;
  public quotationLoading$: Observable<boolean>;
  public updateLoading$: Observable<boolean>;
  public breadcrumbs$: Observable<Breadcrumb[]>;
  public displayTitle = true;

  constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService
  ) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.customerLoading$ = this.store.select(getCustomerLoading);
    this.quotationLoading$ = this.store.select(getQuotationLoading);
    this.updateLoading$ = this.store.select(getUpdateLoading);
    this.breadcrumbs$ = this.store
      .select(getGqId)
      .pipe(
        map((gqId) =>
          this.breadCrumbsService.getQuotationBreadcrumbsForProcessCaseView(
            gqId
          )
        )
      );
  }

  public toggleDisplayTitle(display: boolean): void {
    this.displayTitle = display;
  }
  public updateCaseName(caseName: string): void {
    this.store.dispatch(updateCaseName({ caseName }));
  }
}
