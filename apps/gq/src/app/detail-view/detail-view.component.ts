import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getMaterialNumberandDescription,
  getOffer,
  getQuotation,
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
  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.pipe(select(getQuotation));
    this.materialNumberAndDescription$ = this.store.pipe(
      select(getMaterialNumberandDescription)
    );
  }

  getOffer(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
}
