import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Quotation } from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';
import {
  getOffer,
  getQuotation,
  isCustomerLoading,
  isQuotationLoading,
} from '../core/store/selectors';

@Component({
  selector: 'gq-case-view',
  templateUrl: './process-case-view.component.html',
  styleUrls: ['./process-case-view.component.scss'],
})
export class ProcessCaseViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public offer$: Observable<Quotation>;
  public isCustomerLoading$: Observable<boolean>;
  public isQuotationLoading$: Observable<boolean>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.pipe(select(getQuotation));
    this.isCustomerLoading$ = this.store.pipe(select(isCustomerLoading));
    this.isQuotationLoading$ = this.store.pipe(select(isQuotationLoading));
  }

  getOffer(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
}
