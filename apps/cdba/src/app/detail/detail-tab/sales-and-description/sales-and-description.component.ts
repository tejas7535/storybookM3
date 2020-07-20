import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DetailState } from '../../../core/store/reducers/detail/detail.reducer';
import { getSalesDetails } from '../../../core/store/selectors/details/detail.selector';
import { SalesDetails } from './model/sales-details.model';

@Component({
  selector: 'cdba-sales-and-description',
  templateUrl: './sales-and-description.component.html',
  styleUrls: ['./sales-and-description.component.scss'],
})
export class SalesAndDescriptionComponent implements OnInit {
  public salesDetails$: Observable<SalesDetails>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.salesDetails$ = this.store.pipe(select(getSalesDetails));
  }
}
