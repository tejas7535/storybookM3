import { AssessmentLinechartModule } from '../../shared/chart/assessment-linechart/assessment-linechart.module';
import { MatCardModule } from '@angular/material/card';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { setMaintenanceAssessmentDisplay } from '../../core/store';
import { MaintenanceAssessmentComponent } from './maintenance-assessment.component';
import { GCMHeatmapCardModule } from './gcm-heatmap-card/gcm-heatmap-card.module';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
describe('MaintenanceAssessmentComponent', () => {
  let component: MaintenanceAssessmentComponent;
  let spectator: Spectator<MaintenanceAssessmentComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: MaintenanceAssessmentComponent,
    imports: [
      ReactiveFormsModule,
      AssessmentLinechartModule,
      GCMHeatmapCardModule,
      // Material Modules
      MatCardModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          greaseStatus: {
            loading: false,
            result: undefined,
          },
          shaft: {
            loading: false,
            result: undefined,
            status: {
              result: undefined,
              loading: false,
            },
          },
          bearing: {
            loading: false,
            result: {},
          },
          edmMonitor: {},
          maintenanceAssessment: {
            display: {
              waterContent_1: true,
              deterioration_1: true,
              temperatureOptics_1: true,
              waterContent_2: true,
              deterioration_2: true,
              temperatureOptics_2: true,
              rsmShaftSpeed: true,
              edm01Ai01Counter: true,
              edm01Ai02Counter: true,
            },
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
    declarations: [MaintenanceAssessmentComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display Form', () => {
    it('should dispatch setMaintenanceAss on valueChanges', () => {
      mockStore.dispatch = jest.fn();

      component.displayForm.markAsDirty();
      component.displayForm.patchValue({ rsmShaftSpeed: false });

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setMaintenanceAssessmentDisplay({
          maintenanceAssessmentDisplay: {
            waterContent_1: true,
            deterioration_1: true,
            temperatureOptics_1: true,
            waterContent_2: true,
            deterioration_2: true,
            temperatureOptics_2: true,
            rsmShaftSpeed: false,
            edm01Ai01Counter: true,
            edm01Ai02Counter: true,
          },
        })
      );
    });
  });
});
