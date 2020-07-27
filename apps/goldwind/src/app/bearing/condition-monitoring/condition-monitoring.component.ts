import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { IotThing, Message } from '../../core/store/reducers/thing/models';
import { ThingState } from '../../core/store/reducers/thing/thing.reducer';
import {
  getCurrentMessage,
  getSocketStatus,
  getThingThing,
} from '../../core/store/selectors/thing/thing.selector';

@Component({
  selector: 'goldwind-condition-monitoring',
  templateUrl: './condition-monitoring.component.html',
  styleUrls: ['./condition-monitoring.component.scss'],
})
export class ConditionMonitoringComponent implements OnInit {
  thing$: Observable<IotThing>;
  currentMessage$: Observable<Message>;
  socketStatus$: Observable<number>;

  public constructor(private readonly store: Store<ThingState>) {}

  ngOnInit(): void {
    this.thing$ = this.store.pipe(select(getThingThing));
    this.currentMessage$ = this.store.pipe(select(getCurrentMessage));
    this.socketStatus$ = this.store.pipe(select(getSocketStatus));
  }
}
