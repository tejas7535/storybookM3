import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { DATE_FORMAT } from '../../../shared/constants';
import { CenterLoadComponent } from './center-load.component';

describe('CenterLoadComponent', () => {
  let component: CenterLoadComponent;
  let spectator: Spectator<CenterLoadComponent>;

  const createComponent = createComponentFactory({
    component: CenterLoadComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      MatIconModule,
      MatSliderModule,
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          loadSense: {
            loading: false,
            result: undefined,
            interval: {
              startDate: 123456789,
              endDate: 987654321,
            },
          },
        },
      }),
    ],
    declarations: [CenterLoadComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatDate', () => {
    it('should return a correctly formatted date string', () => {
      const mockDate = new Date(1466424490000);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const mockCurrent = '2021-04-11T17:55:09Z';

      expect(component.formatDate(mockCurrent)).toBe(
        mockDate.toLocaleTimeString(DATE_FORMAT.local, DATE_FORMAT.options)
      );
    });
  });
});
