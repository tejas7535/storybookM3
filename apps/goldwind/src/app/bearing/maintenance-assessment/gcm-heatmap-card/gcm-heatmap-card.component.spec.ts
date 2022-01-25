import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { AssessmentLinechartModule } from '../../../shared/chart/assessment-linechart/assessment-linechart.module';
import { GcmHeatmapCardComponent } from './gcm-heatmap-card.component';
window.ResizeObserver = resize_observer_polyfill;

describe('GcmHeatmapCardComponent', () => {
  let component: GcmHeatmapCardComponent;
  let spectator: Spectator<GcmHeatmapCardComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: GcmHeatmapCardComponent,
    imports: [
      ReactiveFormsModule,
      AssessmentLinechartModule,
      // Material Modules
      MatCardModule,
      MatIconModule,
      MatIconTestingModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('../../../shared/chart/echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {},
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [GcmHeatmapCardComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
