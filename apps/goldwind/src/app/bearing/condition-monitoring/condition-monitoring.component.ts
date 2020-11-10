import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '../../core/store/reducers';
import { MainBearing } from '../../core/store/reducers/bearing/models';
import { LoadSense } from '../../core/store/reducers/load-sense/models';
import { getMainBearing } from '../../core/store/selectors/';

@Component({
  selector: 'goldwind-load-sense',
  templateUrl: './condition-monitoring.component.html',
  styleUrls: ['./condition-monitoring.component.scss'],
})
export class ConditionMonitoringComponent implements OnInit {
  mainBearing$: Observable<MainBearing>;
  loadSense$: Observable<LoadSense[]>;
  live$: Observable<boolean>;

  public constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.mainBearing$ = this.store.pipe(select(getMainBearing));
  }
}
