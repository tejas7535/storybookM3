import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DISPLAY } from '../../../testing/mocks';
import {
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
} from '../../core/store';
import { BearingMetadata } from '../../core/store/reducers/bearing/models';
import { AssessmentLinechartModule } from '../../shared/chart/assessment-linechart/assessment-linechart.module';
import { LoadDistributionCardModule } from '../condition-monitoring/load-distribution-card/load-distribution-card.module';
import { LoadAssessmentComponent } from './load-assessment.component';

describe('LoadAssessmentComponent', () => {
  let component: LoadAssessmentComponent;
  let spectator: Spectator<LoadAssessmentComponent>;
  let mockStore: MockStore;

  const bearingMetaData: BearingMetadata = {
    id: 'bbc9a782-f0fc-4a5a-976e-b28cfe187b19',
    name: 'Windturbine of qa-009',
    type: 'WT_QA_009',
    description:
      'Windturbing with qa-009 connected. Used for generating mock data',
    manufacturer: 'Schaeffler',
    locationLatitude: 49.563_106_5,
    locationLongitude: 10.884_736_2,
    edgeDevice: {
      description: 'Edge device test desc',
      id: 'id-edge-device',
      manufacturer: 'Schaeffler',
      name: 'edge-device-test',
      serialNumber: '234',
      type: 'test',
    },
    windFarm: {
      id: 'test-windfarm',
      country: 'Test',
      description: 'Test Windfarm',
      locationLatitude: 0.22,
      locationLongitude: 2.33,
      name: 'Windfarm Test',
      owner: 'Goldwind',
    },
  };

  const createComponent = createComponentFactory({
    component: LoadAssessmentComponent,
    imports: [
      RouterTestingModule,
      ReactiveFormsModule,
      AssessmentLinechartModule,
      LoadDistributionCardModule,

      // Material Modules
      MatCardModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            loading: false,
            result: bearingMetaData,
          },
          loadAssessment: {
            display: DISPLAY,
            interval: {
              startDate: 123_456_789,
              endDate: 987_654_321,
            },
          },
        },
      }),
    ],
    declarations: [LoadAssessmentComponent],
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
    it('should dispatch setLoadAssessmentDisplay on valueChanges', () => {
      mockStore.dispatch = jest.fn();

      component.displayForm.markAsDirty();
      component.displayForm.patchValue({ lsp01Strain: true });

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setLoadAssessmentDisplay({ loadAssessmentDisplay: DISPLAY })
      );
    });
  });

  describe('setLoadAssessmentInterval', () => {
    it('should dispatch the setEdmInterval action', () => {
      mockStore.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };

      component.setInterval(mockInterval);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setLoadAssessmentInterval({ interval: mockInterval })
      );
    });
  });
});
