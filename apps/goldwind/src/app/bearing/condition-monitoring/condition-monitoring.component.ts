import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '../../core/store/reducers';
import { BearingMetadata } from '../../core/store/reducers/bearing/models';
import { getBearingResult } from '../../core/store/selectors';

@Component({
  selector: 'goldwind-condition-monitoring',
  templateUrl: './condition-monitoring.component.html',
  styleUrls: ['./condition-monitoring.component.scss'],
})
export class ConditionMonitoringComponent implements OnInit {
  mainBearing$: Observable<BearingMetadata>;

  public constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.mainBearing$ = this.store.pipe(select(getBearingResult));
  }
}
