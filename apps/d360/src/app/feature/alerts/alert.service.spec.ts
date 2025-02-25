import { HttpClient } from '@angular/common/http';

import {
  combineLatest,
  Observable,
  of,
  switchMap,
  throwError,
  timer,
} from 'rxjs';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { IServerSideGetRowsParams } from 'ag-grid-enterprise';

import { CurrencyService } from '../info/currency.service';
import { AlertDataResult, AlertService } from './alert.service';
import {
  largeMockAlertResult,
  mockAlertArray,
  mockAlertResult,
} from './alert.service.mocks';
import { AlertCategory, AlertStatus, OpenFunction } from './model';

describe('AlertService', () => {
  let spectator: SpectatorService<AlertService>;
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

  const providers = [
    mockProvider(CurrencyService, {
      getCurrentCurrency(): Observable<string> {
        return of('EUR');
      },
    }),
  ];
  const postMock: jest.Mock<Observable<AlertDataResult>, []> = jest.fn(() =>
    of({
      rows: mockAlertResult,
      rowCount: mockAlertResult.length,
    })
  );

  const serviceFactory = createServiceFactory({
    service: AlertService,
    providers: [
      ...providers,
      {
        provide: HttpClient,
        useValue: {
          get: () => of(),
          post: postMock,
        },
      },
    ],
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    const chunkSize = 1000;

    it('should load 1000 alerts in a single request', (done) => {
      const mockedData = mockAlertArray(1000);
      postMock.mockImplementation(() =>
        of({ rowCount: 1000, rows: mockedData })
      );
      const spectatorHttp = serviceFactory();
      const service = spectatorHttp.service;

      expect(postMock).toBeCalledTimes(1);

      let hasError: boolean;
      service.getFetchErrorEvent().subscribe((errorValue) => {
        hasError = errorValue;
      });

      service.getLoadingEvent().subscribe((loadingValue) => {
        if (!loadingValue) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(loadingValue).toEqual(false);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(hasError).toBeUndefined();
          // eslint-disable-next-line jest/no-conditional-expect
          expect(service.allActiveAlerts()).toEqual(mockedData);
          done();
        }
      });
    });

    it('should load more than 1000 alerts in chunks', () => {
      const myPostMock = jest.fn(() =>
        of({ rowCount: 5000, rows: mockAlertArray(chunkSize) })
      );
      const spectatorHttp = serviceFactory({
        providers: [
          ...providers,
          {
            provide: HttpClient,
            useValue: {
              get: () => of(),
              post: myPostMock,
            },
          },
        ],
      });
      const service = spectatorHttp.service;

      expect(myPostMock).toBeCalledTimes(5);

      let hasError: boolean;
      service.getFetchErrorEvent().subscribe((errorValue) => {
        hasError = errorValue;
      });

      service.getLoadingEvent().subscribe((loadingValue) => {
        expect(loadingValue).toEqual(false);
        expect(hasError).toBeUndefined();
      });
    });

    it('load correct data when all requests succeed', (done) => {
      const mockedData = mockAlertArray(5000);
      let mockCounter = 0;

      postMock.mockImplementation(() => {
        const startIndex = mockCounter * chunkSize;
        const slicedData = mockedData.slice(startIndex, startIndex + chunkSize);
        mockCounter = mockCounter + 1;

        return of({ rowCount: 5000, rows: slicedData });
      });
      const spectatorHttp = serviceFactory();
      const service = spectatorHttp.service;

      service.getLoadingEvent().subscribe((loadingValue) => {
        if (!loadingValue) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(service.allActiveAlerts().length).toBe(5000);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mockedData).toEqual(service.allActiveAlerts());
          done();
        }
      });
    });

    it('should retry 3 times, emit an error and set loading to false when the outer observable fails', (done) => {
      const myPostMock = jest.fn(() =>
        timer(100).pipe(switchMap(() => throwError(() => 'Fehler')))
      );
      const spectatorHttp = serviceFactory({
        providers: [
          ...providers,
          {
            provide: HttpClient,
            useValue: {
              get: () => of(),
              post: myPostMock,
            },
          },
        ],
      });
      const service = spectatorHttp.service;

      combineLatest([
        service.getFetchErrorEvent(),
        service.getLoadingEvent(),
      ]).subscribe(([hasError, isLoading]) => {
        expect(myPostMock).toBeCalledTimes(3);
        if (service.allActiveAlerts() !== null) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(hasError).toBe(true);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(isLoading).toBe(false);
          done();
        }
      });
    });

    it('should emit an error and set loading to false when an inner observable fails', (done) => {
      let callCounter = 0;
      const myPostMock = jest.fn(() => {
        callCounter = callCounter + 1;

        return callCounter > 1
          ? timer(100).pipe(switchMap(() => throwError(() => 'Fehler')))
          : timer(100).pipe(
              switchMap(() =>
                of({ rowCount: 5000, rows: mockAlertArray(chunkSize) })
              )
            );
      });
      const spectatorHttp = serviceFactory({
        providers: [
          ...providers,
          {
            provide: HttpClient,
            useValue: {
              get: () => of(),
              post: myPostMock,
            },
          },
        ],
      });
      const service = spectatorHttp.service;

      combineLatest([
        service.getFetchErrorEvent(),
        service.getLoadingEvent(),
      ]).subscribe(([hasError, isLoading]) => {
        if (service.allActiveAlerts() !== null) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(hasError).toBe(true);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(isLoading).toBe(false);
          done();
        }
      });
    });
  });

  describe('methods', () => {
    describe('groupDataByCustomerAndPriority', () => {
      beforeEach(() => {
        spectator = serviceFactory();
      });

      it('should handle an empty input correctly', () => {
        const groupedResult = spectator.service.groupDataByCustomerAndPriority(
          []
        );
        expect(groupedResult).toEqual([]);
      });

      it('should sort the grouped data', () => {
        const groupedResult =
          spectator.service.groupDataByCustomerAndPriority(
            largeMockAlertResult
          );
        expect(groupedResult).toEqual([
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
        ]);
      });

      it('should group data by customer and priority', () => {
        const result =
          spectator.service.groupDataByCustomerAndPriority(mockAlertResult);
        expect(result).toEqual([
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
        ]);
      });
    });

    describe('createAlertDatasource', () => {
      beforeEach(() => {
        spectator = serviceFactory();
      });

      it('should call the success callback on successful response from the endpoint', () => {
        postMock.mockImplementation(() =>
          of({
            rows: mockAlertResult,
            rowCount: mockAlertResult.length,
          })
        );
        spectator.service
          .createAlertDatasource(AlertStatus.ACTIVE)
          .getRows(params);

        expect(successMock).toHaveBeenCalledWith({
          rowCount: 3,
          rowData: mockAlertResult,
        });
      });

      it('should call the error callback on error from the backend', () => {
        postMock.mockImplementation(() => throwError(() => 'Fehler'));
        spectator.service
          .createAlertDatasource(AlertStatus.ACTIVE)
          .getRows(params);

        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
