import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { Observable, of } from 'rxjs';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { IServerSideGetRowsParams } from 'ag-grid-enterprise';

import { CurrencyService } from '../info/currency.service';
import { AlertService } from './alert.service';
import { largeMockAlertResult, mockAlertResult } from './alert.service.mocks';
import { AlertCategory, OpenFunction, Priority } from './model';

describe('AlertService', () => {
  let spectator: SpectatorService<AlertService>;
  let httpTesting: SpyObject<HttpTestingController>;
  const successMock = jest.fn();
  const errorMock = jest.fn();
  const params: IServerSideGetRowsParams = {
    api: undefined,
    context: undefined,
    parentNode: undefined,
    request: {
      startRow: 0,
      endRow: 100,
      sortModel: [],
      filterModel: {},
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
    },
    fail: errorMock,
    success: successMock,
  };
  const createHttp = createServiceFactory({
    service: AlertService,
    providers: [
      mockProvider(CurrencyService, {
        getCurrentCurrency(): Observable<string> {
          return of('EUR');
        },
      }),
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => {
    spectator = createHttp();
    httpTesting = spectator.inject(HttpTestingController);
    httpTesting.expectOne(
      'api/alerts/notification/count',
      'Get the notification count'
    );
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('createGroupedAlertDatasource', () => {
    it('should load the correct result for an empty result from the alert endpoint', () => {
      spectator.service
        .createGroupedAlertDatasource(
          'ACTIVE',
          OpenFunction.Validation_Of_Demand
        )
        .getRows(params);
      const alertRequest = httpTesting.expectOne(
        'api/alerts?status=ACTIVE&currency=EUR&openFunction=VOD',
        'Load the alerts'
      );
      alertRequest.flush({ rows: [] });

      expect(successMock).toHaveBeenCalledWith({ rowCount: 0, rowData: [] });
    });

    it('should load the grouped data and filter by priority', () => {
      spectator.service
        .createGroupedAlertDatasource(
          'ACTIVE',
          OpenFunction.Validation_Of_Demand,
          undefined,
          [Priority.Priority1]
        )
        .getRows(params);

      const alertRequest = httpTesting.expectOne(
        'api/alerts?status=ACTIVE&currency=EUR&openFunction=VOD',
        'Load the alerts'
      );
      alertRequest.flush({
        rows: mockAlertResult,
        rowCount: mockAlertResult.length,
      });

      expect(successMock).toHaveBeenCalledWith({
        rowCount: 1,
        rowData: [
          {
            customerNumber: '1',
            customerName: 'first customer',
            openFunction: OpenFunction.Validation_Of_Demand,
            priorityCount: { '1': 2 },
            alertTypes: { '1': [AlertCategory.ACIADP, AlertCategory.NPOSDP] },
          },
        ],
      });
    });

    it('should load the grouped data and filter by customer', () => {
      spectator.service
        .createGroupedAlertDatasource(
          'ACTIVE',
          OpenFunction.Validation_Of_Demand,
          ['2'],
          [Priority.Priority1, Priority.Priority2]
        )
        .getRows(params);
      const alertRequest = httpTesting.expectOne(
        'api/alerts?status=ACTIVE&currency=EUR&openFunction=VOD',
        'Load the alerts'
      );
      alertRequest.flush({
        rows: mockAlertResult,
        rowCount: mockAlertResult.length,
      });

      expect(successMock).toHaveBeenCalledWith({
        rowCount: 1,
        rowData: [
          {
            customerNumber: '2',
            customerName: 'second customer',
            openFunction: OpenFunction.Validation_Of_Demand,
            priorityCount: { '2': 1 },
            alertTypes: { '2': [AlertCategory.CFSUAO] },
          },
        ],
      });
    });
    it('should sort the grouped data', () => {
      spectator.service
        .createGroupedAlertDatasource(
          'ACTIVE',
          OpenFunction.Validation_Of_Demand,
          undefined,
          [Priority.Priority1, Priority.Priority2]
        )
        .getRows(params);
      const alertRequest = httpTesting.expectOne(
        'api/alerts?status=ACTIVE&currency=EUR&openFunction=VOD',
        'Load the alerts'
      );
      alertRequest.flush({
        rows: largeMockAlertResult,
        rowCount: largeMockAlertResult.length,
      });

      expect(successMock).toHaveBeenCalledWith({
        rowCount: 3,
        rowData: [
          {
            customerNumber: '3',
            customerName: 'third customer',
            openFunction: OpenFunction.Validation_Of_Demand,
            priorityCount: { '1': 3, '2': 1, '3': 1 },
            alertTypes: {
              '1': [AlertCategory.CFSUAO],
              '2': [AlertCategory.NPOSDP],
              '3': [AlertCategory.ACIADP],
            },
          },
          {
            customerNumber: '1',
            customerName: 'first customer',
            openFunction: OpenFunction.Validation_Of_Demand,
            priorityCount: { '1': 2 },
            alertTypes: { '1': [AlertCategory.ACIADP, AlertCategory.NPOSDP] },
          },
          {
            customerNumber: '2',
            customerName: 'second customer',
            openFunction: OpenFunction.Validation_Of_Demand,
            priorityCount: { '2': 1 },
            alertTypes: { '2': [AlertCategory.CFSUAO] },
          },
        ],
      });
    });

    it('should call the error callback when the endpoint returns an error', () => {
      spectator.service
        .createGroupedAlertDatasource(
          'ACTIVE',
          OpenFunction.Validation_Of_Demand
        )
        .getRows(params);

      const alertRequest = httpTesting.expectOne(
        'api/alerts?status=ACTIVE&currency=EUR&openFunction=VOD',
        'Load the alerts'
      );
      alertRequest.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(errorMock).toHaveBeenCalledWith();
    });
  });

  describe('createAlertDatasource', () => {
    it('should call the success callback on successful response from the endpoint', () => {
      spectator.service.createAlertDatasource('ACTIVE').getRows(params);

      const alertRequest = httpTesting.expectOne(
        'api/alerts?status=ACTIVE&currency=EUR',
        'Load the alerts'
      );
      alertRequest.flush({
        rows: mockAlertResult,
        rowCount: mockAlertResult.length,
      });

      expect(successMock).toHaveBeenCalledWith({
        rowCount: 3,
        rowData: mockAlertResult,
      });
    });

    it('should call the error callback on error from the backend', () => {
      spectator.service.createAlertDatasource('ACTIVE').getRows(params);

      const alertRequest = httpTesting.expectOne(
        'api/alerts?status=ACTIVE&currency=EUR',
        'Load the alerts'
      );
      alertRequest.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(errorMock).toHaveBeenCalledWith();
    });
  });
});
