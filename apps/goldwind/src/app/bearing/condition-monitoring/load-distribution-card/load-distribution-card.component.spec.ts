import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { DATE_FORMAT } from '../../../shared/constants';
import { LoadDistributionCardComponent } from './load-distribution-card.component';

describe('CenterLoadComponent', () => {
  let component: LoadDistributionCardComponent;
  let spectator: Spectator<LoadDistributionCardComponent>;

  const createComponent = createComponentFactory({
    component: LoadDistributionCardComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      MatIconModule,
      MatSliderModule,
      RouterTestingModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          loadSense: {
            loading: false,
            result: undefined,
            interval: {
              startDate: 123_456_789,
              endDate: 987_654_321,
            },
          },
        },
      }),
    ],
    declarations: [LoadDistributionCardComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
