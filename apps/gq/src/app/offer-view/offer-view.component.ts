import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Quotation, QuotationDetail } from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';
import { getOffer, getQuotation } from '../core/store/selectors';

@Component({
  selector: 'gq-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss'],
})
export class OfferViewComponent implements OnInit {
  public offer$: Observable<QuotationDetail[]>;
  public quotation$: Observable<Quotation>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.offer$ = this.store.pipe(select(getOffer));
    this.quotation$ = this.store.pipe(select(getQuotation));
  }
}
