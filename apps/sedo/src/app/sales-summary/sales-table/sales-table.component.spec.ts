import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MATERIAL_SANITY_CHECKS,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import {
  GridApi,
  GridReadyEvent,
  IStatusPanelParams,
  RowClickedEvent,
} from 'ag-grid-enterprise';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

import { APP_STATE_MOCK } from '../../../testing/mocks/app-state-mock';
import { salesSummaryMock } from '../../../testing/mocks/sales-summary.mock';
import { AgGridStateService } from '../../shared/services/ag-grid-state/ag-grid-state.service';
import { DataService } from '../../shared/services/data/data.service';
import { SalesTableComponent } from './sales-table.component';

describe('SalesTableComponent', () => {
  let component: SalesTableComponent;
  let spectator: Spectator<SalesTableComponent>;
  let dataService: DataService;
  let activatedRoute: ActivatedRoute;

  const createComponent = createComponentFactory({
    component: SalesTableComponent,
    imports: [
      CommonModule,
      HttpClientTestingModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
      MatListModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonModule,
      BrowserDynamicTestingModule,
      AgGridModule,
    ],
    declarations: [SalesTableComponent],
    providers: [
      DataService,
      AgGridStateService,
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {},
          },
        },
      },
      provideMockStore({
        initialState: APP_STATE_MOCK,
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    dataService = spectator.inject(DataService);
    activatedRoute = spectator.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the data', async () => {
      component['setSubscription'] = jest.fn();
      dataService.getAllSales = jest.fn().mockResolvedValue([salesSummaryMock]);
      dataService.getSuperUser = jest.fn().mockResolvedValue('superUser');

      await component.ngOnInit();

      expect(dataService.getAllSales).toHaveBeenCalledTimes(1);
      expect(component.rowData).toEqual([salesSummaryMock]);
      expect(component.detailCellRendererParams).toStrictEqual({
        superUser: 'superUser',
      });

      expect(component['setSubscription']).toHaveBeenCalledTimes(1);
    });
  });

  describe('onFirstDataRendered', () => {
    it('should set combinedKey filter from queryparams when defined', () => {
      component['setupColumState'] = jest.fn();
      const combinedKey = 'abc key';
      activatedRoute.snapshot.queryParams = { combinedKey };

      const fakeApi = {
        getFilterInstance: jest.fn(),
        getDisplayedRowAtIndex: jest.fn(),
        onFilterChanged: jest.fn(),
      } as unknown as GridApi;

      const fakeFilterModel = {
        setModel: jest.fn(),
      };

      fakeApi.getFilterInstance = jest.fn().mockReturnValue(fakeFilterModel);
      const fakeNode = {
        setExpanded: jest.fn(),
      };
      fakeApi.getDisplayedRowAtIndex = jest.fn().mockReturnValue(fakeNode);
      fakeApi.onFilterChanged = jest.fn();

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        context: undefined,
      };

      component.onFirstDataRendered(fakeEvent);

      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledTimes(1);
      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledWith(
        'combinedKey'
      );

      expect(fakeFilterModel.setModel).toHaveBeenCalledTimes(1);
      expect(fakeFilterModel.setModel).toHaveBeenCalledWith({
        values: [combinedKey],
      });

      expect(fakeNode.setExpanded).toHaveBeenCalledTimes(1);
      expect(fakeNode.setExpanded).toHaveBeenCalledWith(true);

      expect(fakeEvent.api.getDisplayedRowAtIndex).toHaveBeenCalledTimes(1);
      expect(fakeEvent.api.getDisplayedRowAtIndex).toHaveBeenCalledWith(0);

      expect(fakeApi.onFilterChanged).toHaveBeenCalledTimes(1);

      expect(component['setupColumState']).toHaveBeenCalledTimes(1);
      expect(component['gridApi']).toBeDefined();
    });

    it('should set materialNumber filter from queryparams when defined', () => {
      const materialNumber = '0000-111-222-333';
      activatedRoute.snapshot.queryParams = { materialNumber };

      const fakeApi = {
        getFilterInstance: jest.fn(),
        onFilterChanged: jest.fn(),
      } as unknown as GridApi;

      const fakeFilterModel = {
        setModel: jest.fn(),
      };

      fakeApi.getFilterInstance = jest.fn().mockReturnValue(fakeFilterModel);
      fakeApi.onFilterChanged = jest.fn();

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        context: undefined,
      };

      component.onFirstDataRendered(fakeEvent);

      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledTimes(1);
      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledWith(
        'socoArticleNumberGlobalKey'
      );

      expect(fakeFilterModel.setModel).toHaveBeenCalledTimes(1);
      expect(fakeFilterModel.setModel).toHaveBeenCalledWith({
        values: [materialNumber],
      });

      expect(fakeApi.onFilterChanged).toHaveBeenCalledTimes(1);
    });

    it('should not set filter if no queryParams', () => {
      activatedRoute.snapshot.queryParams = {};
      const fakeApi = {
        getFilterInstance: jest.fn(),
        onFilterChanged: jest.fn(),
        setFilterModel: jest.fn(),
      } as unknown as GridApi;

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        context: undefined,
      };

      component.onFirstDataRendered(fakeEvent);

      expect(fakeApi.setFilterModel).toHaveBeenCalledTimes(0);
    });
  });

  describe('columnChange', () => {
    it('should set column state', () => {
      const event = {
        api: {
          getColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].setColumnState = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('setupColumState', () => {
    it('should apply column state from state service', () => {
      const params = {
        api: {
          applyColumnState: jest.fn(),
        },
      } as unknown as GridReadyEvent;
      const mockColumnState: { colId: string; sort: 'asc' | 'desc' }[] = [
        { colId: 'foo', sort: 'asc' },
      ];
      component['agGridStateService'].getColumnState = jest.fn(
        () => mockColumnState
      );

      component['setupColumState'](params);

      expect(params.api.applyColumnState).toHaveBeenCalledWith({
        state: mockColumnState,
        applyOrder: true,
      });
    });
  });

  describe('onRowClicked', () => {
    it('should set node expanded to true', () => {
      const fakeEvent = {
        node: {
          setExpanded: jest.fn(),
          expanded: false,
        },
      } as unknown as RowClickedEvent;

      component.onRowClicked(fakeEvent);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledTimes(1);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledWith(true);
    });

    it('should set node expanded to false', () => {
      const fakeEvent = {
        node: {
          setExpanded: jest.fn(),
          expanded: true,
        },
      } as unknown as RowClickedEvent;

      component.onRowClicked(fakeEvent);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledTimes(1);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledWith(false);
    });

    describe('setSubscription', () => {
      it('should add subscription', () => {
        const userId = 'abc';
        component['store'].select = jest.fn().mockReturnValue(of(userId));

        component['setSubscription']();

        expect(component['username']).toEqual(userId);
        expect(component['store'].select).toHaveBeenCalledWith(
          getUserUniqueIdentifier
        );
      });
    });

    describe('setLastModifierFilter', () => {
      it('should set lastModifier filter', () => {
        const userId = 'userid';

        const fakeApi = {
          getFilterInstance: jest.fn(),
          onFilterChanged: jest.fn(),
          setFilterModel: jest.fn(),
        } as unknown as GridApi;

        fakeApi.onFilterChanged = jest.fn();

        component['gridApi'] = fakeApi;
        component['username'] = userId;

        component.setLastModifierFilter();

        expect(fakeApi.setFilterModel).toHaveBeenCalledTimes(1);
        expect(fakeApi.setFilterModel).toHaveBeenCalledWith({
          values: ['lastModifier'],
        });
        expect(fakeApi.onFilterChanged).toHaveBeenCalledTimes(1);
      });
    });

    describe('setKeyUserFilter', () => {
      it('should set lastModifier filter', () => {
        const userId = 'userid';

        const fakeApi = {
          getFilterInstance: jest.fn(),
          onFilterChanged: jest.fn(),
          setFilterModel: jest.fn(),
        } as unknown as GridApi;

        fakeApi.onFilterChanged = jest.fn();

        component['gridApi'] = fakeApi;
        component['username'] = userId;

        component.setKeyUserFilter();

        expect(fakeApi.setFilterModel).toHaveBeenCalledTimes(1);
        expect(fakeApi.setFilterModel).toHaveBeenCalledWith({
          values: ['keyUser'],
        });

        expect(fakeApi.onFilterChanged).toHaveBeenCalledTimes(1);
      });
    });

    describe('reset', () => {
      it('should set lastModifier filter', () => {
        const fakeApi = {
          onFilterChanged: jest.fn(),
          setFilterModel: jest.fn(),
        } as unknown as GridApi;

        fakeApi.onFilterChanged = jest.fn();
        fakeApi.setFilterModel = jest.fn();

        component['gridApi'] = fakeApi;

        component.resetAllFilter();

        expect(fakeApi.setFilterModel).toHaveBeenCalledWith(undefined);
        expect(fakeApi.onFilterChanged).toHaveBeenCalledTimes(1);
      });
    });

    describe('ngOnDestroy', () => {
      it('should unsubscribe', () => {
        component['shutDown$$'].next = jest.fn();

        component.ngOnDestroy();

        expect(component['shutDown$$'].next).toHaveBeenCalled();
      });
    });
  });
});
