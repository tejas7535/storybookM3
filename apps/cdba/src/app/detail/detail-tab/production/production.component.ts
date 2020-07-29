import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DetailState } from '../../../core/store/reducers/detail/detail.reducer';
import { getProductionDetails } from '../../../core/store/selectors';
import { ProductionDetails } from './model/production.details.model';

@Component({
  selector: 'cdba-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
})
export class ProductionComponent implements OnInit {
  public productionDetails$: Observable<ProductionDetails>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.productionDetails$ = this.store.pipe(select(getProductionDetails));
  }
}
