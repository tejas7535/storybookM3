import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { BreakpointService } from '@schaeffler/responsive';

import { DevicesState } from '../core/store/reducers/devices/devices.reducer';
import { Device } from '../core/store/reducers/devices/models';
import { getDevicesResult } from '../core/store/selectors/devices/devices.selector';

@Component({
  selector: 'goldwind-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();
  devices$: Observable<Device[]>;

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

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
