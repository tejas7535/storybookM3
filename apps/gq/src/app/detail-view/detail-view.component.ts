import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getMaterialNumberAndDescription,
  getOffer,
  getQuotation,
  isMaterialLoading,
  isQuotationLoading,
} from '../core/store';
import { Quotation, QuotationDetail } from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public offer$: Observable<QuotationDetail[]>;
  public materialNumberAndDescription$: Observable<any>;
  public materialLoading$: Observable<boolean>;
  public quotationLoading$: Observable<boolean>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.pipe(select(getQuotation));
    this.materialNumberAndDescription$ = this.store.pipe(
      select(getMaterialNumberAndDescription)
    );

    this.materialNumberAndDescription$ = this.store.pipe(
      select(getMaterialNumberAndDescription)
    );

    this.materialLoading$ = this.store.pipe(select(isMaterialLoading));

    this.quotationLoading$ = this.store.pipe(select(isQuotationLoading));
  }

  getOffer(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
}
