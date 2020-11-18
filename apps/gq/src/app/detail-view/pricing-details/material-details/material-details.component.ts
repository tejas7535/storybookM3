import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getMaterialDetails } from '../../../core/store';
import { MaterialDetails } from '../../../core/store/models';
import { DetailState } from '../../../core/store/reducers/detail-case/detail-case.reducer';

@Component({
  selector: 'gq-material-details',
  templateUrl: './material-details.component.html',
  styleUrls: ['./material-details.component.scss'],
})
export class MaterialDetailsComponent implements OnInit {
  materialDetails$: Observable<MaterialDetails>;
  constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.materialDetails$ = this.store.pipe(select(getMaterialDetails));
  }
}
