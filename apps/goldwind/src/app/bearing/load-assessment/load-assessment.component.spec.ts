import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
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
      MatIconTestingModule,
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
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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

  describe('handleZoom', () => {
    it('should dispatch an interval effect with caluclated percentage time ranges', () => {
      mockStore.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1_599_655_000, // 10% of from pristineStart
        endDate: 1_599_695_000, // 10% of from pristineEnd
        pristineStart: 1_599_650_000,
        pristineEnd: 1_599_700_000,
        zoom: true,
      };

      component.prisineInterval.start = mockInterval.pristineStart;
      component.prisineInterval.end = mockInterval.pristineEnd;
      component.handleZoom({ start: 10, end: 90 });

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setLoadAssessmentInterval({ interval: mockInterval })
      );
    });

    it('should dispatch with prisitine Value when event passed 0 on start', () => {
      mockStore.dispatch = jest.fn();

      component.prisineInterval.start = 1_599_650_000;
      component.prisineInterval.end = 1_599_700_000;

      component.handleZoom({ start: 0, end: 90 });
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setLoadAssessmentInterval({
          interval: {
            startDate: component.prisineInterval.start,
            endDate: 1_599_695_000, // 10% of from pristineEnd
            pristineStart: component.prisineInterval.start,
            pristineEnd: component.prisineInterval.end,
            zoom: true,
          },
        })
      );
    });

    it('should dispatch with prisitine Value when event passed 100 on end', () => {
      mockStore.dispatch = jest.fn();

      component.prisineInterval.start = 1_599_650_000;
      component.prisineInterval.end = 1_599_700_000;

      component.handleZoom({ start: 10, end: 100 });
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setLoadAssessmentInterval({
          interval: {
            startDate: 1_599_655_000, // 10% of from pristineStart
            endDate: component.prisineInterval.end, // 10% of from pristineEnd
            pristineStart: component.prisineInterval.start,
            pristineEnd: component.prisineInterval.end,
            zoom: true,
          },
        })
      );
    });
  });
});
