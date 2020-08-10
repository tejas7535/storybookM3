import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Edm, IotThing, Message } from '../../core/store/reducers/thing/models';
import { ThingState } from '../../core/store/reducers/thing/thing.reducer';
import {
  getCurrentMessage,
  getEdm,
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
  edm$: Observable<Edm>;
  currentMessage$: Observable<Message>;
  socketStatus$: Observable<number>;

  public constructor(private readonly store: Store<ThingState>) {}

  ngOnInit(): void {
    this.thing$ = this.store.pipe(select(getThingThing));
    this.edm$ = this.store.pipe(select(getEdm));
    this.currentMessage$ = this.store.pipe(select(getCurrentMessage));
    this.socketStatus$ = this.store.pipe(select(getSocketStatus));
  }
}
