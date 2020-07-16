import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DetailState } from '../../core/store/reducers/detail/detail.reducer';
import { getQuantitiesDetails } from '../../core/store/selectors/details/detail.selector';
import { QuantitiesDetails } from './model/quantities.model';

@Component({
  selector: 'cdba-quantities',
  templateUrl: './quantities.component.html',
  styleUrls: ['./quantities.component.scss'],
})
export class QuantitiesComponent implements OnInit {
  public quantitiesDetails$: Observable<QuantitiesDetails>;

  public constructor(private readonly store: Store<DetailState>) {}
  public currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.quantitiesDetails$ = this.store.pipe(select(getQuantitiesDetails));
  }
}
