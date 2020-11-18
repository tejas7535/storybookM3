import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getMaterialNumber15, getOffer, getQuotation } from '../core/store';
import { Quotation, QuotationDetail } from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducers';

@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public offer$: Observable<QuotationDetail[]>;
  public materialNumber15$: Observable<string>;
  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.pipe(select(getQuotation));
    this.materialNumber15$ = this.store.pipe(select(getMaterialNumber15));
  }

  getOffer(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
}
