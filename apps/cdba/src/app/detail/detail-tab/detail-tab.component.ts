import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getReferenceTypeLoading } from '../../core/store';
import { DetailState } from '../../core/store/reducers/detail/detail.reducer';

@Component({
  selector: 'cdba-detail-tab',
  templateUrl: './detail-tab.component.html',
  styleUrls: ['./detail-tab.component.scss'],
})
export class DetailTabComponent implements OnInit {
  isLoading$: Observable<boolean>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(getReferenceTypeLoading));
  }
}
