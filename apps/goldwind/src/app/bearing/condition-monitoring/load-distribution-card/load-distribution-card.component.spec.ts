import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSliderModule } from '@angular/material/slider';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { DashboardMoreInfoDialogComponent } from '../../../shared/dashboard-more-info-dialog/dashboard-more-info-dialog.component';
import { LoadDistributionCardComponent } from './load-distribution-card.component';

describe('CenterLoadComponent', () => {
  let component: LoadDistributionCardComponent;
  let spectator: Spectator<LoadDistributionCardComponent>;

  const createComponent = createComponentFactory({
    component: LoadDistributionCardComponent,
    detectChanges: true,
    imports: [
      MatDialogModule,
      MatCardModule,
      MatIconModule,
      MatIconTestingModule,
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
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [
      LoadDistributionCardComponent,
      DashboardMoreInfoDialogComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.detectChanges();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
