import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { ConnectionState } from '../core/store/reducers/devices/models';
import { StatusType } from '../shared/status-indicator/status-indicator.component';
import { StatusIndicatorModule } from '../shared/status-indicator/status-indicator.module';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let spectator: Spectator<OverviewComponent>;

  const createComponent = createComponentFactory({
    component: OverviewComponent,
    imports: [
      RouterTestingModule,
      StatusIndicatorModule,
      MatCardModule,
      MatDividerModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          devices: {
            loading: false,
            result: undefined,
          },
        },
      }),
    ],
    declarations: [OverviewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('composeStatus', () => {
    const testText = 'This is the title';
    const testNotifications: any[] = [];

    test('should return a "ok" status object on connect', () => {
      const testState = ConnectionState.connected;

      const expectedStatus = {
        type: StatusType.ok,
        text: testText,
        notifications: testNotifications,
      };

      expect(component.composeStatus(testState, testText)).toStrictEqual(
        expectedStatus
      );
    });

    test('should return a "error" status object on disconnect', () => {
      const testState = ConnectionState.disconnected;

      const expectedStatus = {
        type: StatusType.error,
        text: testText,
        notifications: testNotifications,
      };

      expect(component.composeStatus(testState, testText)).toStrictEqual(
        expectedStatus
      );
    });

    test('should return also a "error" status object on unknown connection', () => {
      const testState = 'unknown connection';

      const expectedStatus = {
        type: StatusType.error,
        text: testText,
        notifications: testNotifications,
      };

      // prevents the unknown status output
      console.log = jest.fn();

      expect(component.composeStatus(testState, testText)).toStrictEqual(
        expectedStatus
      );
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
