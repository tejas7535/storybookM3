import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getSelectedQuotationDetail } from '../../core/store';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';
import { QuotationDetail } from '../../shared/models/quotation-detail';

@Component({
  selector: 'gq-pricing-details',
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.scss'],
})
export class PricingDetailsComponent implements OnInit {
  public quotationDetail$: Observable<QuotationDetail>;

  public constructor(private readonly store: Store<ProcessCaseState>) {}

  ngOnInit(): void {
    this.quotationDetail$ = this.store.pipe(select(getSelectedQuotationDetail));
  }
}
