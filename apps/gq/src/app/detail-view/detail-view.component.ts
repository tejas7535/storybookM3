import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getMaterialOfSelectedQuotationDetail,
  getOffer,
  getQuotation,
  isQuotationLoading,
} from '../core/store';
import { MaterialDetails, Quotation } from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public quotationLoading$: Observable<boolean>;
  public offer$: Observable<Quotation>;
  public material$: Observable<MaterialDetails>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.pipe(select(getQuotation));
    this.quotationLoading$ = this.store.pipe(select(isQuotationLoading));
    this.material$ = this.store.pipe(
      select(getMaterialOfSelectedQuotationDetail)
    );
  }

  getOffer(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
}
