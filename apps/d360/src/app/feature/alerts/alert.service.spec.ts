import { EMPTY, of, Subscription, throwError } from 'rxjs';

import { IServerSideGetRowsParams } from 'ag-grid-enterprise';

import { AppRoutePath } from '../../app.routes.enum';
import { Stub } from '../../shared/test/stub.class';
import { AlertService } from './alert.service';
import { Alert, AlertStatus, OpenFunction, Priority } from './model';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    service = Stub.get<AlertService>({
      component: AlertService,
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should call loadActiveAlerts', () => {
      const loadActiveAlertsSpy = jest.spyOn(service, 'loadActiveAlerts');

      service.init();

      expect(loadActiveAlertsSpy).toHaveBeenCalled();
    });

    it('should call refreshHashTimer', () => {
      const refreshHashTimerSpy = jest.spyOn(service, 'refreshHashTimer');

      service.init();

      expect(refreshHashTimerSpy).toHaveBeenCalled();
    });

    it('should subscribe to refreshEvent and call loadActiveAlerts on event', () => {
      const loadActiveAlertsSpy = jest.spyOn(service, 'loadActiveAlerts');
      const refreshEventSpy = jest
        .spyOn(service['refreshEvent'], 'pipe')
        .mockReturnValue(of(undefined as any));

      service.init();

      expect(refreshEventSpy).toHaveBeenCalled();
      expect(loadActiveAlertsSpy).toHaveBeenCalled();
    });
  });

  describe('loadActiveAlerts', () => {
    it('should set loadingEvent to true if hideLoading is false', () => {
      const loadingEventSpy = jest.spyOn(service['loadingEvent'], 'next');

      service.loadActiveAlerts(false);

      expect(loadingEventSpy).toHaveBeenCalledWith(true);
    });

    it('should not set loadingEvent to true if hideLoading is true', () => {
      const loadingEventSpy = jest.spyOn(service['loadingEvent'], 'next');

      service.loadActiveAlerts(true);

      expect(loadingEventSpy).not.toHaveBeenCalledWith(true);
    });

    it('should set fetchErrorEvent to false', () => {
      const fetchErrorEventSpy = jest.spyOn(service['fetchErrorEvent'], 'next');

      service.loadActiveAlerts();

      expect(fetchErrorEventSpy).toHaveBeenCalledWith(false);
    });

    it('should call requestAlerts with correct parameters', () => {
      const requestAlertsSpy = jest
        .spyOn(service as any, 'requestAlerts')
        .mockReturnValue(
          of({
            rows: [],
            rowCount: 0,
          })
        );

      service.loadActiveAlerts();

      expect(requestAlertsSpy).toHaveBeenCalledWith(
        {
          startRow: 0,
          endRow: 999,
          sortModel: [],
          filterModel: [],
        },
        AlertStatus.ACTIVE
      );
    });

    it('should set fetchErrorEvent to true on request error', (done) => {
      jest
        .spyOn(service as any, 'requestAlerts')
        .mockReturnValue(throwError(() => new Error('error')));
      const fetchErrorEventSpy = jest.spyOn(service['fetchErrorEvent'], 'next');

      service.loadActiveAlerts();

      setTimeout(() => {
        expect(fetchErrorEventSpy).toHaveBeenCalledWith(true);
        done();
      });
    });

    it('should call snackbarService.openSnackBar on request error', (done) => {
      jest
        .spyOn(service as any, 'requestAlerts')
        .mockReturnValue(throwError(() => new Error('error')));
      const snackbarServiceSpy = jest.spyOn(
        service['snackbarService'],
        'openSnackBar'
      );

      service.loadActiveAlerts();

      setTimeout(() => {
        expect(snackbarServiceSpy).toHaveBeenCalledWith('error.loading_failed');
        done();
      });
    });

    it('should set allActiveAlerts to an empty array on request error', (done) => {
      jest.spyOn(service as any, 'requestAlerts').mockReturnValue(EMPTY);
      const allActiveAlertsSpy = jest.spyOn(service['allActiveAlerts'], 'set');

      service.loadActiveAlerts();

      setTimeout(() => {
        expect(allActiveAlertsSpy).toHaveBeenCalledWith([]);
        done();
      });
    });

    it('should set loadingEvent to false on finalize', (done) => {
      jest.spyOn(service as any, 'requestAlerts').mockReturnValue(EMPTY);
      const loadingEventSpy = jest.spyOn(service['loadingEvent'], 'next');

      service.loadActiveAlerts();

      setTimeout(() => {
        expect(loadingEventSpy).toHaveBeenCalledWith(false);
        done();
      });
    });

    it('should set allActiveAlerts with the fetched alerts on success', (done) => {
      const alerts = [{ id: '1' }] as Alert[];
      jest.spyOn(service as any, 'requestAlerts').mockReturnValue(
        of({
          rows: alerts,
          rowCount: 1,
        })
      );
      const allActiveAlertsSpy = jest.spyOn(service['allActiveAlerts'], 'set');

      service.loadActiveAlerts();

      setTimeout(() => {
        expect(allActiveAlertsSpy).toHaveBeenCalledWith(alerts);
        done();
      });
    });

    it('should handle multiple chunks of alerts', (done) => {
      const alertsChunk1 = Array.from({ length: 1000 }).fill({
        id: '1',
      }) as Alert[];
      const alertsChunk2 = Array.from({ length: 1000 }).fill({
        id: '2',
      }) as Alert[];
      jest
        .spyOn(service as any, 'requestAlerts')
        .mockReturnValueOnce(
          of({
            rows: alertsChunk1,
            rowCount: 2000,
          })
        )
        .mockReturnValueOnce(
          of({
            rows: alertsChunk2,
            rowCount: 2000,
          })
        );
      const allActiveAlertsSpy = jest.spyOn(service['allActiveAlerts'], 'set');

      service.loadActiveAlerts();

      setTimeout(() => {
        expect(allActiveAlertsSpy).toHaveBeenCalledWith([
          ...alertsChunk1,
          ...alertsChunk2,
        ]);
        done();
      });
    });
  });

  describe('completeAlert', () => {
    it('should call http.post with the correct URL', () => {
      const alertId = '123';
      const httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(of({}));

      service.completeAlert(alertId).subscribe();

      expect(httpPostSpy).toHaveBeenCalledWith(
        `api/alerts/${alertId}/complete`,
        {}
      );
    });
  });

  describe('activateAlert', () => {
    it('should call http.post with the correct URL', () => {
      const alertId = '123';
      const httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(of({}));

      service.activateAlert(alertId).subscribe();

      expect(httpPostSpy).toHaveBeenCalledWith(
        `api/alerts/${alertId}/activate`,
        {}
      );
    });
  });

  describe('deactivateAlert', () => {
    it('should call http.post with the correct URL', () => {
      const alertId = '123';
      const httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(of({}));

      service.deactivateAlert(alertId).subscribe();

      expect(httpPostSpy).toHaveBeenCalledWith(
        `api/alerts/${alertId}/deactivate`,
        {}
      );
    });
  });

  describe('getAlertHash', () => {
    it('should call http.get with the correct URL and responseType', () => {
      const httpGetSpy = jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(of('hash'));

      service.getAlertHash().subscribe();

      expect(httpGetSpy).toHaveBeenCalledWith(service['ALERT_HASH_API'], {
        responseType: 'text',
      });
    });
  });

  describe('getDataFetchedEvent', () => {
    it('should return an observable of dataFetchedEvent', () => {
      const dataFetchedEventSpy = jest.spyOn(
        service['dataFetchedEvent'],
        'asObservable'
      );

      service.getDataFetchedEvent();

      expect(dataFetchedEventSpy).toHaveBeenCalled();
    });
  });

  describe('getFetchErrorEvent', () => {
    it('should return an observable of fetchErrorEvent', () => {
      const fetchErrorEventSpy = jest.spyOn(
        service['fetchErrorEvent'],
        'asObservable'
      );

      service.getFetchErrorEvent();

      expect(fetchErrorEventSpy).toHaveBeenCalled();
    });
  });

  describe('getRefreshEvent', () => {
    it('should return an observable of refreshEvent', () => {
      const refreshEventSpy = jest.spyOn(
        service['refreshEvent'],
        'asObservable'
      );

      service.getRefreshEvent();

      expect(refreshEventSpy).toHaveBeenCalled();
    });
  });

  describe('getLoadingEvent', () => {
    it('should return an observable of loadingEvent', () => {
      const loadingEventSpy = jest.spyOn(
        service['loadingEvent'],
        'asObservable'
      );

      service.getLoadingEvent();

      expect(loadingEventSpy).toHaveBeenCalled();
    });
  });

  describe('createAlertDatasource', () => {
    it('should return a datasource with getRows method', () => {
      const datasource = service.createAlertDatasource(AlertStatus.ACTIVE, [
        Priority.Priority1,
      ]);

      expect(datasource.getRows).toBeDefined();
    });

    it('should call requestAlerts with correct parameters in getRows', () => {
      const params = {
        request: {
          startRow: 0,
          endRow: 100,
          sortModel: [],
          filterModel: [],
        },
        success: jest.fn(),
        fail: jest.fn(),
      } as unknown as IServerSideGetRowsParams<Alert>;

      const requestAlertsSpy = jest
        .spyOn(service as any, 'requestAlerts')
        .mockReturnValue(
          of({
            rows: [],
            rowCount: 0,
          })
        );

      const datasource = service.createAlertDatasource(AlertStatus.ACTIVE, [
        Priority.Priority1,
      ]);
      datasource.getRows(params);

      expect(requestAlertsSpy).toHaveBeenCalledWith(
        params.request,
        AlertStatus.ACTIVE,
        [Priority.Priority1]
      );
    });

    it('should call success with empty data if selectedPriorities is empty', () => {
      const params = {
        request: {
          startRow: 0,
          endRow: 100,
          sortModel: [],
          filterModel: [],
        },
        success: jest.fn(),
        fail: jest.fn(),
      } as unknown as IServerSideGetRowsParams<Alert>;

      const datasource = service.createAlertDatasource(AlertStatus.ACTIVE, []);
      datasource.getRows(params);

      expect(params.success).toHaveBeenCalledWith({ rowData: [], rowCount: 0 });
    });
  });

  describe('refreshHashTimer', () => {
    it('should unsubscribe from the previous timerSubscription if it exists', () => {
      service['timerSubscription'] = new Subscription();

      const unsubscribeSpy = jest.spyOn(
        service['timerSubscription'],
        'unsubscribe'
      );

      service.refreshHashTimer();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should call getAlertHash and update currentHash and clientSideHash', (done) => {
      const hash = 'newHash';
      jest.spyOn(service, 'getAlertHash').mockReturnValue(of(hash));

      service.refreshHashTimer();

      setTimeout(() => {
        expect(service['currentHash']).toBe(hash);
        expect(service['clientSideHash']).toBe(hash);
        done();
      });
    });

    it('should call loadActiveAlerts if clientSideHash is different from hash', (done) => {
      const hash = 'newHash';
      jest.spyOn(service, 'getAlertHash').mockReturnValue(of(hash));
      const loadActiveAlertsSpy = jest.spyOn(service, 'loadActiveAlerts');

      service['clientSideHash'] = 'oldHash';
      service.refreshHashTimer();

      setTimeout(() => {
        expect(loadActiveAlertsSpy).toHaveBeenCalledWith(true);
        done();
      });
    });

    it('should call snackbarService.openSnackBar if currentHash is different from hash', (done) => {
      const hash = 'newHash';
      jest.spyOn(service, 'getAlertHash').mockReturnValue(of(hash));
      const snackbarServiceSpy = jest
        .spyOn(service['snackbarService'], 'openSnackBar')
        .mockReturnValue({
          onAction: () => of(),
        } as any);

      service['currentHash'] = 'oldHash';
      service.refreshHashTimer();

      setTimeout(() => {
        expect(snackbarServiceSpy).toHaveBeenCalledWith(
          'alert.new_data',
          'alert.refresh',
          15_000
        );
        done();
      });
    });

    it('should call refreshEvent.next if snackbar action is triggered', (done) => {
      const hash = 'newHash';
      jest.spyOn(service, 'getAlertHash').mockReturnValue(of(hash));
      jest.spyOn(service['snackbarService'], 'openSnackBar').mockReturnValue({
        onAction: () => of(true),
      } as any);
      const refreshEventSpy = jest.spyOn(service['refreshEvent'], 'next');

      service['currentHash'] = 'oldHash';
      service.refreshHashTimer();

      setTimeout(() => {
        expect(refreshEventSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getRouteForOpenFunction', () => {
    it('should return the correct route for Validation_Of_Demand', () => {
      const route = service.getRouteForOpenFunction(
        OpenFunction.Validation_Of_Demand
      );

      expect(route).toBe(AppRoutePath.DemandValidationPage);
    });

    it('should return the correct route for Customer_Material_Portfolio', () => {
      const route = service.getRouteForOpenFunction(
        OpenFunction.Customer_Material_Portfolio
      );

      expect(route).toBe(AppRoutePath.CustomerMaterialPortfolioPage);
    });

    it('should return "/" for unknown openFunction', () => {
      const route = service.getRouteForOpenFunction('unknown' as OpenFunction);

      expect(route).toBe('/');
    });
  });

  describe('getModuleForOpenFunction', () => {
    it('should return the correct module title for Validation_Of_Demand', () => {
      const moduleTitle = service.getModuleForOpenFunction(
        OpenFunction.Validation_Of_Demand
      );

      expect(moduleTitle).toBe('validation_of_demand.title');
    });

    it('should return the correct module title for Customer_Material_Portfolio', () => {
      const moduleTitle = service.getModuleForOpenFunction(
        OpenFunction.Customer_Material_Portfolio
      );

      expect(moduleTitle).toBe('customer_material_portfolio.title');
    });

    it('should return the openFunction for unknown openFunction', () => {
      const openFunction = 'unknown' as OpenFunction;
      const moduleTitle = service.getModuleForOpenFunction(openFunction);

      expect(moduleTitle).toBe(openFunction);
    });
  });

  describe('groupBy', () => {
    it('should group items by the specified key', () => {
      const input = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 },
      ];
      const expectedOutput = {
        A: [
          { category: 'A', value: 1 },
          { category: 'A', value: 3 },
        ],
        B: [{ category: 'B', value: 2 }],
      };

      const result = service['groupBy'](input, 'category');

      expect(result).toEqual(expectedOutput);
    });

    it('should handle an empty input array', () => {
      const input: any[] = [];
      const expectedOutput = {};

      const result = service['groupBy'](input, 'category');

      expect(result).toEqual(expectedOutput);
    });

    it('should handle input with undefined key values', () => {
      const input = [
        { category: 'A', value: 1 },
        { category: undefined, value: 2 },
        { category: 'A', value: 3 },
      ];
      const expectedOutput = {
        A: [
          { category: 'A', value: 1 },
          { category: 'A', value: 3 },
        ],
        undefined: [{ category: undefined, value: 2 } as any],
      };

      const result = service['groupBy'](input, 'category');

      expect(result).toEqual(expectedOutput);
    });

    it('should handle input with null key values', () => {
      const input = [
        { category: 'A', value: 1 },
        { category: null, value: 2 },
        { category: 'A', value: 3 },
      ];
      const expectedOutput = {
        A: [
          { category: 'A', value: 1 },
          { category: 'A', value: 3 },
        ],
        null: [{ category: null, value: 2 } as any],
      };

      const result = service['groupBy'](input, 'category');

      expect(result).toEqual(expectedOutput);
    });

    it('should handle input with mixed key values', () => {
      const input = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 },
        { category: 'B', value: 4 },
        { category: 'C', value: 5 },
      ];
      const expectedOutput = {
        A: [
          { category: 'A', value: 1 },
          { category: 'A', value: 3 },
        ],
        B: [
          { category: 'B', value: 2 },
          { category: 'B', value: 4 },
        ],
        C: [{ category: 'C', value: 5 }],
      };

      const result = service['groupBy'](input, 'category');

      expect(result).toEqual(expectedOutput);
    });
  });

  describe('groupDataByCustomerAndPriority', () => {
    it('should group alerts by customer number and priority', () => {
      const alerts: Alert[] = [
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority1,
          type: 'Type1',
          openFunction: 'Function1',
          materialNumber: '1',
          materialDescription: 'Material 1',
        } as any,
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority2,
          type: 'Type2',
          openFunction: 'Function1',
          materialNumber: '2',
          materialDescription: 'Material 2',
        } as any,
        {
          customerNumber: '2',
          customerName: 'Customer 2',
          alertPriority: Priority.Priority1,
          type: 'Type1',
          openFunction: 'Function2',
          materialNumber: '2',
          materialDescription: 'Material 2',
        } as any,
      ];

      const result = service.groupDataByCustomerAndPriority(alerts);

      expect(result).toEqual([
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          priorityCount: {
            [Priority.Priority1]: 1,
            [Priority.Priority2]: 1,
          },
          openFunction: 'Function1',
          alertTypes: {
            [Priority.Priority1]: ['Type1'],
            [Priority.Priority2]: ['Type2'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: '1', text: 'Material 1' }],
            [Priority.Priority2]: [{ id: '2', text: 'Material 2' }],
          },
        },
        {
          customerNumber: '2',
          customerName: 'Customer 2',
          priorityCount: {
            [Priority.Priority1]: 1,
          },
          openFunction: 'Function2',
          alertTypes: {
            [Priority.Priority1]: ['Type1'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: '2', text: 'Material 2' }],
          },
        },
      ]);
    });

    it('should handle empty input array', () => {
      const alerts: Alert[] = [];

      const result = service.groupDataByCustomerAndPriority(alerts);

      expect(result).toEqual([]);
    });

    it('should handle alerts with undefined customer number and undefined material', () => {
      const alerts: Alert[] = [
        {
          customerNumber: undefined,
          customerName: 'Customer 1',
          alertPriority: Priority.Priority1,
          type: 'Type1',
          openFunction: 'Function1',
        } as any,
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority2,
          type: 'Type2',
          openFunction: 'Function1',
        } as any,
      ];

      const result = service.groupDataByCustomerAndPriority(alerts);

      expect(result).toEqual([
        {
          customerNumber: 'undefined',
          customerName: 'Customer 1',
          priorityCount: {
            [Priority.Priority1]: 1,
          },
          openFunction: 'Function1',
          alertTypes: {
            [Priority.Priority1]: ['Type1'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: undefined, text: undefined }],
          },
        },
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          priorityCount: {
            [Priority.Priority2]: 1,
          },
          openFunction: 'Function1',
          alertTypes: {
            [Priority.Priority2]: ['Type2'],
          },
          materialNumbers: {
            [Priority.Priority2]: [{ id: undefined, text: undefined }],
          },
        },
      ]);
    });

    it('should handle alerts with null customer number and material', () => {
      const alerts: Alert[] = [
        {
          customerNumber: null,
          customerName: 'Customer 1',
          alertPriority: Priority.Priority1,
          type: 'Type1',
          openFunction: 'Function1',
          materialNumber: null,
          materialDescription: null,
        } as any,
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority2,
          type: 'Type2',
          openFunction: 'Function1',
          materialNumber: null,
          materialDescription: null,
        } as any,
      ];

      const result = service.groupDataByCustomerAndPriority(alerts);

      expect(result).toEqual([
        {
          customerNumber: 'null',
          customerName: 'Customer 1',
          priorityCount: {
            [Priority.Priority1]: 1,
          },
          openFunction: 'Function1',
          alertTypes: {
            [Priority.Priority1]: ['Type1'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: null, text: null }],
          },
        },
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          priorityCount: {
            [Priority.Priority2]: 1,
          },
          openFunction: 'Function1',
          alertTypes: {
            [Priority.Priority2]: ['Type2'],
          },
          materialNumbers: {
            [Priority.Priority2]: [{ id: null, text: null }],
          },
        },
      ]);
    });

    it('should handle alerts with mixed priorities', () => {
      const alerts: Alert[] = [
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority1,
          type: 'Type1',
          openFunction: 'Function1',
          materialNumber: '1',
          materialDescription: 'Material 1',
        } as any,
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority2,
          type: 'Type2',
          openFunction: 'Function1',
          materialNumber: '2',
          materialDescription: 'Material 2',
        } as any,
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority3,
          type: 'Type3',
          openFunction: 'Function1',
          materialNumber: '3',
          materialDescription: 'Material 3',
        } as any,
      ];

      const result = service.groupDataByCustomerAndPriority(alerts);

      expect(result).toEqual([
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          priorityCount: {
            [Priority.Priority1]: 1,
            [Priority.Priority2]: 1,
            [Priority.Priority3]: 1,
          },
          openFunction: 'Function1',
          alertTypes: {
            [Priority.Priority1]: ['Type1'],
            [Priority.Priority2]: ['Type2'],
            [Priority.Priority3]: ['Type3'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: '1', text: 'Material 1' }],
            [Priority.Priority2]: [{ id: '2', text: 'Material 2' }],
            [Priority.Priority3]: [{ id: '3', text: 'Material 3' }],
          },
        },
      ]);
    });

    it('should sort grouped results by priority', () => {
      const alerts: Alert[] = [
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority2,
          type: 'Type2',
          openFunction: 'Function1',
          materialNumber: '2',
          materialDescription: 'Material 2',
        } as any,
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority1,
          type: 'Type1',
          openFunction: 'Function1',
          materialNumber: '1',
          materialDescription: 'Material 1',
        } as any,
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          alertPriority: Priority.Priority3,
          type: 'Type3',
          openFunction: 'Function1',
          materialNumber: '3',
          materialDescription: 'Material 3',
        } as any,
      ];

      const result = service.groupDataByCustomerAndPriority(alerts);

      expect(result).toEqual([
        {
          customerNumber: '1',
          customerName: 'Customer 1',
          priorityCount: {
            [Priority.Priority1]: 1,
            [Priority.Priority2]: 1,
            [Priority.Priority3]: 1,
          },
          openFunction: 'Function1',
          alertTypes: {
            [Priority.Priority1]: ['Type1'],
            [Priority.Priority2]: ['Type2'],
            [Priority.Priority3]: ['Type3'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: '1', text: 'Material 1' }],
            [Priority.Priority2]: [{ id: '2', text: 'Material 2' }],
            [Priority.Priority3]: [{ id: '3', text: 'Material 3' }],
          },
        },
      ]);
    });
  });
});
