import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { QuotationDetail } from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducers';
import { getOffer } from '../core/store/selectors';

@Component({
  selector: 'gq-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss'],
})
export class OfferViewComponent implements OnInit {
  public offer$: Observable<QuotationDetail[]>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
}
