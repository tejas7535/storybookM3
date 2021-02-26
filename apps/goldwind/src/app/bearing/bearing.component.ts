import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { BearingState } from '../core/store/reducers/bearing/bearing.reducer';
import { BearingMetadata } from '../core/store/reducers/bearing/models';
import { getBearingResult } from '../core/store/selectors/bearing/bearing.selector';
import { BearingRoutePath } from './bearing-route-path.enum';

interface TabLinks {
  name: string;
  link: string;
}
@Component({
  selector: 'goldwind-bearing',
  templateUrl: './bearing.component.html',
  styleUrls: ['./bearing.component.scss'],
})
export class BearingComponent implements OnInit {
  bearing$: Observable<BearingMetadata>;

  public constructor(private readonly store: Store<BearingState>) {}

  tabLinks: TabLinks[] = [
    {
      name: 'overview',
      link: BearingRoutePath.ConditionMonitoringPath,
    },
    {
      name: 'dataAnalysis',
      link: BearingRoutePath.GreaseStatusPath,
    },
    {
      name: 'dataView',
      link: BearingRoutePath.DataViewPath,
    },
  ];

  ngOnInit(): void {
    this.bearing$ = this.store.pipe(select(getBearingResult));
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
