import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { BreakpointService } from '@schaeffler/responsive';

import { DevicesState } from '../core/store/reducers/devices/devices.reducer';
import {
  ConnectionState,
  Devices,
} from '../core/store/reducers/devices/models';
import { getDevicesResult } from '../core/store/selectors/devices/devices.selector';
import {
  Status,
  StatusType,
} from '../shared/status-indicator/status-indicator.component';

@Component({
  selector: 'goldwind-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  devices$: Observable<Devices>;

  public isHandsetViewPort: boolean;

  public constructor(
    private readonly breakpointService: BreakpointService,
    private readonly store: Store<DevicesState>
  ) {}

  ngOnInit(): void {
    this.devices$ = this.store.pipe(select(getDevicesResult));
    this.subscriptions.add(
      this.breakpointService
        .isLessThanMedium()
        .subscribe(
          (isLessThanMedium) => (this.isHandsetViewPort = isLessThanMedium)
        )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  composeStatus(
    state: string,
    text: string,
    notifications: string[] = []
  ): Status {
    let type: StatusType;
    switch (state) {
      case ConnectionState.connected:
        type = StatusType.ok;
        break;
      case ConnectionState.disconnected:
        type = StatusType.error;
        break;
      default:
        console.log(`Unknown status: ${type}`);
        type = StatusType.error;
    }

    return {
      type,
      text,
      notifications,
    };
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
