import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';
import {
  getOffer,
  getQuotation,
  getUpdateLoading,
} from '../core/store/selectors';
import { Quotation } from '../shared/models';

@Component({
  selector: 'gq-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss'],
})
export class OfferViewComponent implements OnInit {
  public offer$: Observable<Quotation>;
  public quotation$: Observable<Quotation>;
  public updateIsLoading$: Observable<boolean>;
  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.offer$ = this.store.pipe(select(getOffer));
    this.quotation$ = this.store.pipe(select(getQuotation));
    this.updateIsLoading$ = this.store.pipe(select(getUpdateLoading));
  }
}
