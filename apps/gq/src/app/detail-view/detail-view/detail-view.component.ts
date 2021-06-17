import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getQuotation,
  getSelectedQuotationDetail,
  isQuotationLoading,
} from '../../core/store';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';
import { Quotation } from '../../shared/models';
import { QuotationDetail } from '../../shared/models/quotation-detail';

@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public quotationLoading$: Observable<boolean>;
  public quotationDetail$: Observable<QuotationDetail>;

  public constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.quotationLoading$ = this.store.select(isQuotationLoading);
    this.quotationDetail$ = this.store.select(getSelectedQuotationDetail);
  }
}
