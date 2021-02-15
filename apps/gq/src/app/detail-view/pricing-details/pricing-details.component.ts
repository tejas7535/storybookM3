import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getMaterialOfSelectedQuotationDetail } from '../../core/store';
import { MaterialDetails } from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-pricing-details',
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.scss'],
})
export class PricingDetailsComponent implements OnInit {
  public materialDetails$: Observable<MaterialDetails>;

  public constructor(private readonly store: Store<ProcessCaseState>) {}

  ngOnInit(): void {
    this.materialDetails$ = this.store.pipe(
      select(getMaterialOfSelectedQuotationDetail)
    );
  }
}
