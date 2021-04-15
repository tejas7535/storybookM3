import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { BomItem } from '@cdba/core/store/reducers/detail/models';

import { selectBomItem } from '../store/actions/compare.actions';
import { CompareState } from '../store/reducers/compare.reducer';
import {
  getBomErrorMessage,
  getBomItems,
  getBomLoading,
} from '../store/selectors/compare.selectors';

@Component({
  selector: 'cdba-bom-compare-tab',
  templateUrl: './bom-compare-tab.component.html',
  styleUrls: ['./bom-compare-tab.component.scss'],
})
export class BomCompareTabComponent implements OnInit {
  bomItems1$: Observable<BomItem[]>;
  bomLoading1$: Observable<boolean>;
  bomErrorMessage1$: Observable<string>;

  bomItems2$: Observable<BomItem[]>;
  bomLoading2$: Observable<boolean>;
  bomErrorMessage2$: Observable<string>;

  public constructor(private readonly store: Store<CompareState>) {}

  ngOnInit(): void {
    this.bomItems1$ = this.store.pipe(select(getBomItems, 0));
    this.bomLoading1$ = this.store.pipe(select(getBomLoading, 0));
    this.bomErrorMessage1$ = this.store.pipe(select(getBomErrorMessage, 0));

    this.bomItems2$ = this.store.pipe(select(getBomItems, 1));
    this.bomLoading2$ = this.store.pipe(select(getBomLoading, 1));
    this.bomErrorMessage2$ = this.store.pipe(select(getBomErrorMessage, 1));
  }

  selectBomItem(item: BomItem, index: number): void {
    this.store.dispatch(selectBomItem({ item, index }));
  }
}
