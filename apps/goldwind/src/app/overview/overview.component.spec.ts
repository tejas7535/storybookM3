import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

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

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
