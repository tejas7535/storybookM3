import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DetailState } from '../../../core/store/reducers/detail/detail.reducer';
import { getDimensionAndWeightDetails } from '../../../core/store/selectors';
import { DimensionAndWeightDetails } from './model/dimension-and-weight-details.model';

@Component({
  selector: 'cdba-dimension-and-weight',
  templateUrl: './dimension-and-weight.component.html',
  styleUrls: ['./dimension-and-weight.component.scss'],
})
export class DimensionAndWeightComponent implements OnInit {
  public dimensionAndWeight$: Observable<DimensionAndWeightDetails>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.dimensionAndWeight$ = this.store.pipe(
      select(getDimensionAndWeightDetails)
    );
  }
}
