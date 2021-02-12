import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/auth';

import {
  getMaterialNumberAndDescription,
  getOffer,
  getQuotation,
  getSelectedQuotationDetail,
  getSelectedQuotationDetailId,
  isMaterialLoading,
  isQuotationLoading,
  updateQuotationDetails,
} from '../core/store';
import {
  Quotation,
  QuotationDetail,
  UpdateQuotationDetail,
} from '../core/store/models';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';
import { UserRoles } from '../shared/roles/user-roles.enum';

@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit, OnDestroy {
  public quotation$: Observable<Quotation>;
  public offer$: Observable<QuotationDetail[]>;
  public materialNumberAndDescription$: Observable<any>;
  public materialLoading$: Observable<boolean>;
  public quotationLoading$: Observable<boolean>;
  public manualPricePermission$: Observable<boolean>;
  public gqPositionId: string;
  public selectedQuotationDetail$: Observable<QuotationDetail>;

  private readonly subscription: Subscription = new Subscription();

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

    this.selectedQuotationDetail$ = this.store.pipe(
      select(getSelectedQuotationDetail)
    );

    this.manualPricePermission$ = this.store.pipe(
      select(getRoles),
      map((roles) => roles.includes(UserRoles.MANUAL_PRICE))
    );

    this.subscription.add(
      this.store
        .pipe(select(getSelectedQuotationDetailId))
        .subscribe((id) => (this.gqPositionId = id))
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getOffer(): void {
    this.offer$ = this.store.pipe(select(getOffer));
  }
  selectManualPrice(manualPrice: number): void {
    const quotationDetailIDs: UpdateQuotationDetail[] = [
      {
        gqPositionId: this.gqPositionId,
        price: manualPrice,
      },
    ];
    this.store.dispatch(updateQuotationDetails({ quotationDetailIDs }));
  }
}
