import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColumnsToolPanelModule,
  GridApi,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  IStatusPanelParams,
  RowClickedEvent,
  ServerSideRowModelModule,
  SideBarModule,
} from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { salesSummaryMock } from '../../../testing/mocks/sales-summary.mock';
import { SalesSummary } from '../../core/store/reducers/sales-summary/models/sales-summary.model';
import { DataService } from '../../shared/data.service';
import { Page } from '../../shared/models/page.model';
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
      AgGridModule.withComponents([
        SideBarModule,
        ColumnsToolPanelModule,
        ServerSideRowModelModule,
      ]),
    ],
    declarations: [SalesTableComponent],
    providers: [
      DataService,
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {},
          },
        },
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

  describe('onGridReady', () => {
    it('should setServerSideDataSource', () => {
      const fakeApi = new GridApi();
      fakeApi.setServerSideDatasource = jest.fn();

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        columnApi: undefined,
        context: undefined,
      };

      component.onGridReady(fakeEvent);
      expect(fakeApi.setServerSideDatasource).toHaveBeenCalledTimes(1);
    });

    it('should set combinedKey filter from queryparams when defined', () => {
      const combinedKey = 'abc key';
      activatedRoute.snapshot.queryParams = { combinedKey };

      const fakeApi = new GridApi();
      fakeApi.setServerSideDatasource = jest.fn();

      const fakeFilterModel = {
        setModel: jest.fn(),
      };

      fakeApi.getFilterInstance = jest.fn().mockReturnValue(fakeFilterModel);

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        columnApi: undefined,
        context: undefined,
      };

      component.onGridReady(fakeEvent);

      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledTimes(1);
      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledWith(
        'combinedKey'
      );

      expect(fakeFilterModel.setModel).toHaveBeenCalledTimes(1);
      expect(fakeFilterModel.setModel).toHaveBeenCalledWith({
        type: 'equals',
        filter: combinedKey,
      });
      expect(component.combinedKeyQueryParam).toEqual(combinedKey);
    });

    it('should set materialNumber filter from queryparams when defined', () => {
      const materialNumber = '0000-111-222-333';
      activatedRoute.snapshot.queryParams = { materialNumber };

      const fakeApi = new GridApi();
      fakeApi.setServerSideDatasource = jest.fn();

      const fakeFilterModel = {
        setModel: jest.fn(),
      };

      fakeApi.getFilterInstance = jest.fn().mockReturnValue(fakeFilterModel);

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        columnApi: undefined,
        context: undefined,
      };

      component.onGridReady(fakeEvent);

      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledTimes(1);
      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledWith(
        'socoArticleNumberGlobalKey'
      );

      expect(fakeFilterModel.setModel).toHaveBeenCalledTimes(1);
      expect(fakeFilterModel.setModel).toHaveBeenCalledWith({
        type: 'equals',
        filter: materialNumber,
      });

      expect(component.combinedKeyQueryParam).toBeUndefined();
    });

    it('should not set filter if no queryParams', () => {
      activatedRoute.snapshot.queryParams = {};
      const fakeApi = new GridApi();
      fakeApi.setServerSideDatasource = jest.fn();

      const fakeFilterModel = {
        setModel: jest.fn(),
      };

      fakeApi.getFilterInstance = jest.fn().mockReturnValue(fakeFilterModel);

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        columnApi: undefined,
        context: undefined,
      };

      component.onGridReady(fakeEvent);

      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledTimes(0);

      expect(fakeFilterModel.setModel).toHaveBeenCalledTimes(0);

      expect(component.combinedKeyQueryParam).toBeUndefined();
    });
  });

  describe('onRowClicked', () => {
    it('should set node expanded to true', () => {
      const fakeEvent = ({
        node: {
          setExpanded: jest.fn(),
          expanded: false,
        },
      } as unknown) as RowClickedEvent;

      component.onRowClicked(fakeEvent);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledTimes(1);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledWith(true);
    });

    it('should set node expanded to false', () => {
      const fakeEvent = ({
        node: {
          setExpanded: jest.fn(),
          expanded: true,
        },
      } as unknown) as RowClickedEvent;

      component.onRowClicked(fakeEvent);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledTimes(1);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledWith(false);
    });
  });

  describe('onFirstDataRendered', () => {
    it(
      'should do nothing',
      waitForAsync(() => {
        const fakeNode = {
          setExpanded: jest.fn(),
        };

        const fakeParams = {
          api: {
            getDisplayedRowAtIndex: jest.fn().mockReturnValue(fakeNode),
          },
        };

        component.combinedKeyQueryParam = undefined;

        component.onFirstDataRendered(fakeParams).then(() => {
          expect(fakeParams.api.getDisplayedRowAtIndex).toHaveBeenCalledTimes(
            0
          );
          expect(fakeNode.setExpanded).toHaveBeenCalledTimes(0);
        });
      })
    );

    it(
      'should expand node',
      waitForAsync(() => {
        const fakeNode = {
          setExpanded: jest.fn(() => {}),
        };

        const fakeParams = {
          api: {
            getDisplayedRowAtIndex: jest.fn().mockReturnValue(fakeNode),
          },
        };

        component.combinedKeyQueryParam = 'abc';

        jest.useFakeTimers();

        component.onFirstDataRendered(fakeParams).then(() => {
          expect(fakeNode.setExpanded).toHaveBeenCalledTimes(1);
          expect(fakeNode.setExpanded).toHaveBeenCalledWith(true);

          expect(fakeParams.api.getDisplayedRowAtIndex).toHaveBeenCalledTimes(
            1
          );
          expect(fakeParams.api.getDisplayedRowAtIndex).toHaveBeenCalledWith(0);
          jest.useRealTimers();
        });

        jest.advanceTimersByTime(1501);
      })
    );
  });

  describe('fetchRows', () => {
    it(
      'should call successCallback and showNoRowsOverlay',
      waitForAsync(async () => {
        const requestParams: IServerSideGetRowsRequest = {
          startRow: 0,
          endRow: 25,
          rowGroupCols: undefined,
          valueCols: undefined,
          pivotCols: undefined,
          pivotMode: undefined,
          groupKeys: undefined,
          filterModel: {},
          sortModel: [],
        };

        const serverSideGetRowParams: IServerSideGetRowsParams = {
          api: ({
            showNoRowsOverlay: jest.fn(),
          } as unknown) as GridApi,
          parentNode: undefined,
          successCallback: jest.fn(),
          failCallback: jest.fn(),
          columnApi: undefined,
          request: requestParams,
        };

        const fakeResponse: Page<SalesSummary> = {
          content: [],
          pageNumber: 0,
          pageSize: 0,
          totalItemsCount: 0,
          totalPageCount: 0,
        };

        dataService.getSalesSummaryPromise = jest
          .fn()
          .mockResolvedValue(fakeResponse);

        await component['fetchRows'](serverSideGetRowParams);

        expect(serverSideGetRowParams.successCallback).toHaveBeenCalledTimes(1);
        expect(serverSideGetRowParams.successCallback).toHaveBeenCalledWith(
          fakeResponse.content,
          fakeResponse.totalItemsCount
        );

        expect(serverSideGetRowParams.failCallback).toHaveBeenCalledTimes(0);

        expect(
          serverSideGetRowParams.api.showNoRowsOverlay
        ).toHaveBeenCalledTimes(1);
      })
    );

    it(
      'should call successCallback but not showNoRowsOverlay',
      waitForAsync(async () => {
        const requestParams: IServerSideGetRowsRequest = {
          startRow: 0,
          endRow: 25,
          rowGroupCols: undefined,
          valueCols: undefined,
          pivotCols: undefined,
          pivotMode: undefined,
          groupKeys: undefined,
          filterModel: {},
          sortModel: [],
        };

        const serverSideGetRowParams: IServerSideGetRowsParams = {
          api: ({
            showNoRowsOverlay: jest.fn(),
          } as unknown) as GridApi,
          parentNode: undefined,
          successCallback: jest.fn(),
          failCallback: jest.fn(),
          columnApi: undefined,
          request: requestParams,
        };

        const fakeResponse: Page<SalesSummary> = {
          content: [salesSummaryMock],
          pageNumber: 0,
          pageSize: 1,
          totalItemsCount: 1,
          totalPageCount: 1,
        };

        dataService.getSalesSummaryPromise = jest
          .fn()
          .mockResolvedValue(fakeResponse);

        await component['fetchRows'](serverSideGetRowParams);

        expect(serverSideGetRowParams.successCallback).toHaveBeenCalledTimes(1);
        expect(serverSideGetRowParams.successCallback).toHaveBeenCalledWith(
          fakeResponse.content,
          fakeResponse.totalItemsCount
        );

        expect(serverSideGetRowParams.failCallback).toHaveBeenCalledTimes(0);

        expect(
          serverSideGetRowParams.api.showNoRowsOverlay
        ).toHaveBeenCalledTimes(0);
      })
    );

    it(
      'should call failCallback',
      waitForAsync(async () => {
        const requestParams: IServerSideGetRowsRequest = {
          startRow: 0,
          endRow: 25,
          rowGroupCols: undefined,
          valueCols: undefined,
          pivotCols: undefined,
          pivotMode: undefined,
          groupKeys: undefined,
          filterModel: {},
          sortModel: [],
        };

        const serverSideGetRowParams: IServerSideGetRowsParams = {
          api: undefined,
          parentNode: undefined,
          successCallback: jest.fn(),
          failCallback: jest.fn(),
          columnApi: undefined,
          request: requestParams,
        };

        dataService.getSalesSummaryPromise = jest
          .fn()
          .mockRejectedValue('testing logging error');

        await component['fetchRows'](serverSideGetRowParams);

        expect(serverSideGetRowParams.successCallback).toHaveBeenCalledTimes(0);
        expect(serverSideGetRowParams.failCallback).toHaveBeenCalledTimes(1);
      })
    );
  });
});
// tslint:disable-next-line: max-file-line-count
