import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import * as fromStore from '../core/store';
import { IotThing } from '../core/store/reducers/thing/models';
import { ThingState } from '../core/store/reducers/thing/thing.reducer';
import { getThingThing } from '../core/store/selectors/thing/thing.selector';
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
  thing$: Observable<IotThing>;

  public constructor(private readonly store: Store<ThingState>) {}

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
    this.thing$ = this.store.pipe(select(getThingThing));
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromStore.disconnectStomp());
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
