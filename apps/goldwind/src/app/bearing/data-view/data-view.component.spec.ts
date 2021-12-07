import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSelectModule } from '@angular/material/select';

import { GridApi } from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  setDataInterval,
  setFrequency,
} from '../../core/store/actions/data-view/data-view.actions';
import { DateRangeModule } from '../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../shared/empty-graph/empty-graph.module';
import { DataViewComponent } from './data-view.component';

describe('DataViewComponent', () => {
  let component: DataViewComponent;
  let spectator: Spectator<DataViewComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: DataViewComponent,
    imports: [
      ReactiveFormsModule,
      DateRangeModule,
      EmptyGraphModule,
      MatCardModule,
      MatIconModule,
      MatIconTestingModule,
      MatSelectModule,
      AgGridModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          dataView: {
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
    declarations: [DataViewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setDataInterval', () => {
    it('should dispatch the setDataInterval action', () => {
      mockStore.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };

      component.setInterval(mockInterval);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setDataInterval({ interval: mockInterval })
      );
    });
  });

  describe('setFrequency', () => {
    it('should dispatch the setFrequency action', () => {
      mockStore.dispatch = jest.fn();

      const mockFrequency = 6969;

      component.setFrequency(mockFrequency);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setFrequency({ frequency: mockFrequency })
      );
    });
  });

  describe('onGridReady', () => {
    it('should set api', () => {
      const params = {
        api: {
          getSelectedRows: jest.fn(),
        } as unknown as GridApi,
      };

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
    });
  });

  describe('export', () => {
    it('should alert the affected rows for now', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      const mockedSelectedRows = [
        {
          type: 'Load',
          description: 'Radial Load y',
        },
        {
          type: 'Load',
          description: 'Radial Load z',
        },
      ];

      const params = {
        api: {
          getSelectedRows: jest.fn(() => mockedSelectedRows),
        } as unknown as GridApi,
      };

      component['gridApi'] = params.api;

      component.export();

      expect(window.alert).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        `Future Export will include: Radial Load y,Radial Load z`
      );
    });
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
