import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import * as fromStore from '../core/store';
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
export class BearingComponent implements OnInit, OnDestroy {
  bearing$: Observable<BearingMetadata>;

  public constructor(private readonly store: Store<BearingState>) {}

  tabLinks: TabLinks[] = [
    {
      name: 'overview',
      link: BearingRoutePath.ConditionMonitoringPath,
    },
    {
      name: 'bearingLoadAndAssessment',
      link: BearingRoutePath.BasePath,
    },
    {
      name: 'greaseStatus',
      link: BearingRoutePath.BasePath,
    },
    {
      name: 'dataView',
      link: BearingRoutePath.BasePath,
    },
  ];

  ngOnInit(): void {
    this.bearing$ = this.store.pipe(select(getBearingResult));
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromStore.disconnectStomp());
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
