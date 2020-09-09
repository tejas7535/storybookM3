import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { selectBomItem } from '../../core/store';
import { DetailState } from '../../core/store/reducers/detail/detail.reducer';
import { BomItem } from '../../core/store/reducers/detail/models';
import {
  getBomErrorMessage,
  getBomItems,
  getBomLoading,
} from '../../core/store/selectors/details/detail.selector';

@Component({
  selector: 'cdba-bom-tab',
  templateUrl: './bom-tab.component.html',
  styleUrls: ['./bom-tab.component.scss'],
})
export class BomTabComponent implements OnInit {
  bomItems$: Observable<BomItem[]>;
  bomLoading$: Observable<boolean>;
  bomErrorMessage$: Observable<string>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.bomItems$ = this.store.pipe(select(getBomItems));
    this.bomLoading$ = this.store.pipe(select(getBomLoading));
    this.bomErrorMessage$ = this.store.pipe(select(getBomErrorMessage));
  }

  selectBomItem(item: BomItem): void {
    this.store.dispatch(selectBomItem({ item }));
  }
}
