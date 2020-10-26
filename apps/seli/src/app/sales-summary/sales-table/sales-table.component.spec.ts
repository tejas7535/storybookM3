import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColumnsToolPanelModule,
  GridApi,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  IStatusPanelParams,
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

  const createComponent = createComponentFactory({
    component: SalesTableComponent,
    imports: [
      CommonModule,
      HttpClientTestingModule,
      AgGridModule.withComponents([
        SideBarModule,
        ColumnsToolPanelModule,
        ServerSideRowModelModule,
      ]),
    ],
    declarations: [SalesTableComponent],
    providers: [DataService],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    dataService = spectator.inject(DataService);
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
  });

  describe('fetchRows', () => {
    it(
      'should call successCallback',
      waitForAsync(() => {
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
          successCallback: jest.fn(() => {
            expect(
              serverSideGetRowParams.successCallback
            ).toHaveBeenCalledTimes(1);
            expect(serverSideGetRowParams.successCallback).toHaveBeenCalledWith(
              fakeResponse.content,
              fakeResponse.totalItemsCount
            );

            expect(serverSideGetRowParams.failCallback).toHaveBeenCalledTimes(
              0
            );

            expect(
              serverSideGetRowParams.api.showNoRowsOverlay
            ).toHaveBeenCalledTimes(0);
          }),
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

        component['fetchRows'](serverSideGetRowParams);
      })
    );

    it(
      'should show no rows overlay',
      waitForAsync(() => {
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
          successCallback: jest.fn(() => {
            expect(
              serverSideGetRowParams.successCallback
            ).toHaveBeenCalledTimes(1);
            expect(serverSideGetRowParams.successCallback).toHaveBeenCalledWith(
              fakeResponse.content,
              fakeResponse.totalItemsCount
            );

            expect(serverSideGetRowParams.failCallback).toHaveBeenCalledTimes(
              0
            );

            expect(
              serverSideGetRowParams.api.showNoRowsOverlay
            ).toHaveBeenCalledTimes(1);
          }),
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

        component['fetchRows'](serverSideGetRowParams);
      })
    );

    it(
      'should call failCallback',
      waitForAsync(() => {
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
          failCallback: jest.fn(() => {
            expect(
              serverSideGetRowParams.successCallback
            ).toHaveBeenCalledTimes(0);
            expect(serverSideGetRowParams.failCallback).toHaveBeenCalledTimes(
              1
            );
          }),
          columnApi: undefined,
          request: requestParams,
        };

        dataService.getSalesSummaryPromise = jest
          .fn()
          .mockRejectedValue('testing logging error');

        component['fetchRows'](serverSideGetRowParams);
      })
    );
  });
});
