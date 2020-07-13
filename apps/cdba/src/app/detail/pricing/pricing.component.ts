import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DetailState } from '../../core/store/reducers/detail/detail.reducer';
import { getPriceDetails } from '../../core/store/selectors/details/detail.selector';
import { PriceDetails } from './model/price.details.model';

@Component({
  selector: 'cdba-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  public salesPrice$: Observable<PriceDetails>;
  public currentYear = new Date().getFullYear();

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.salesPrice$ = this.store.pipe(select(getPriceDetails));
  }
}
