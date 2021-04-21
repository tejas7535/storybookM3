import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getCustomerCurrency } from '../../../../core/store';
import { ProcessCaseState } from '../../../../core/store/reducers/process-case/process-case.reducer';
import { QuotationDetail } from '../../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-production-cost-details',
  templateUrl: './production-cost-details.component.html',
  styleUrls: ['./production-cost-details.component.scss'],
})
export class ProductionCostDetailsComponent implements OnInit {
  @Input() quotationDetail: QuotationDetail;
  customerCurrency$: Observable<string>;

  public constructor(private readonly store: Store<ProcessCaseState>) {}

  ngOnInit(): void {
    this.customerCurrency$ = this.store.pipe(select(getCustomerCurrency));
  }
}
