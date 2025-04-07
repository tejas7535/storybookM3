import { HttpParams } from '@angular/common/http';

import {
  BehaviorSubject,
  isEmpty,
  lastValueFrom,
  Observable,
  of,
  take,
  throwError,
} from 'rxjs';

import { SortModelItem } from 'ag-grid-enterprise';

import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { MessageType } from '../../shared/models/message-type.enum';
import { Stub } from '../../shared/test/stub.class';
import { CustomerEntry } from '../global-selection/model';
import { CMPService } from './cmp.service';
import { CMPEntry } from './model';

describe('CMPService', () => {
  let service: CMPService;

  beforeEach(
    () =>
      (service = Stub.get<CMPService>({
        component: CMPService,
      }))
  );

  describe('getForecastActionData', () => {
    it('should return success response when valid cmpData is provided', (done) => {
      const mockResponse = {
        overallStatus: MessageType.Success,
        overallErrorMsg: null,
        response: [{ id: 1, name: 'Test' }],
      } as any;

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      service
        .getForecastActionData({
          customerNumber: '123',
          materialNumber: '456',
          successorMaterial: '789',
        } as any)
        .pipe(take(1))
        .subscribe((result) => {
          expect(service['http'].post).toHaveBeenCalledWith(
            'api/customer-material-portfolio/cfcr-action',
            {
              customerNumber: '123',
              materialNumber: '456',
              successorMaterial: '789',
            }
          );

          expect(result).toEqual(mockResponse);

          done();
        });
    });

    it('should return empty observable when cmpData is invalid', (done) => {
      const result = service.getForecastActionData(null);

      expect(result).toBeInstanceOf(Observable);

      result.pipe(take(1), isEmpty()).subscribe((res) => {
        expect(res).toEqual(true);
        done();
      });
    });
  });

  describe('getCMPCriteriaData', () => {
    it('should fetch criteria data from API', (done) => {
      const mockResponse = {
        fields: ['field1', 'field2'],
        labels: ['Label1', 'Label2'],
      };

      jest
        .spyOn(service['http'] as any, 'get')
        .mockReturnValue(of(mockResponse));

      service
        .getCMPCriteriaData()
        .pipe(take(1))
        .subscribe((result) => {
          expect(service['http'].get).toHaveBeenCalledWith(
            'api/customer-material-portfolio/criteria-fields'
          );
          expect(result).toEqual(mockResponse);

          done();
        });
    });
  });

  describe('saveBulkPhaseIn', () => {
    it('should post bulk phase in request with dryRun parameter', (done) => {
      const mockRequest = {
        data: ['item1', 'item2'],
        type: 'phase-in',
      } as any;

      const mockResponse = {
        materialResults: [{ id: 1, status: 'COMPLETED' }],
      };

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      service
        .saveBulkPhaseIn(mockRequest, true)
        .pipe(take(1))
        .subscribe((result) => {
          expect(service['http'].post).toHaveBeenCalledWith(
            'api/customer-material-portfolio/bulk-phase-in',
            mockRequest,
            { params: new HttpParams().set('dryRun', 'true') }
          );
          expect(result).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: mockResponse.materialResults,
          });

          done();
        });
    });

    it('should handle error responses', async () => {
      const mockError = {
        status: 500,
        message: 'Internal Server Error',
      };

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(throwError(() => mockError));

      const result = await lastValueFrom(
        service.saveBulkPhaseIn({} as any, false)
      ).catch((error) => error);

      expect(result).toEqual({
        overallStatus: MessageType.Error,
        overallErrorMsg: 'error.unknown',
        response: [],
      });
    });
  });

  describe('saveCMPChange', () => {
    it('should handle confirmation needed response', (done) => {
      const mockResponse = {
        confirmationNeeded: true,
        message: 'Confirmation required for this action',
      };

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      const cmpData = {
        autoSwitchDate: null,
        customerNumber: '123',
        materialNumber: '456',
        successorMaterial: '789',
        portfolioStatus: 'SE',
        demandCharacteristic: null,
        demandPlanAdoption: undefined,
        repDate: null,
      } as any;

      service
        .saveCMPChange(cmpData, false, 'action-url')
        .pipe(take(1))
        .subscribe((result) => {
          expect(service['http'].post).toHaveBeenCalledWith(
            'api/customer-material-portfolio/action-url',
            cmpData,
            { params: { dryRun: 'false' } }
          );
          expect(result).toEqual({
            overallStatus: MessageType.Warning,
            overallErrorMsg:
              'customer.material_portfolio.modal.substitution.warning.add_material',
            response: [mockResponse],
          });

          done();
        });
    });

    it('should handle missing actionURL', (done) => {
      const cmpData = {
        customerNumber: '123',
        materialNumber: '456',
        successorMaterial: '789',
        portfolioStatus: 'SE',
      } as any;

      service
        .saveCMPChange(cmpData, false, null)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: MessageType.Error,
            overallErrorMsg: 'error.unknown',
            response: [],
          });

          done();
        });
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new Error('HTTP error occurred');
      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(throwError(() => mockError));

      const cmpData = {
        customerNumber: '123',
        materialNumber: '456',
        successorMaterial: '789',
        portfolioStatus: 'SE',
      } as any;

      service
        .saveCMPChange(cmpData, false, 'action-url')
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: MessageType.Error,
            overallErrorMsg: mockError.message,
            response: [],
          });

          done();
        });
    });
  });

  describe('createCustomerMaterialPortfolioDatasource', () => {
    it('should fetch data with correct parameters', (done) => {
      (service as any)['dataFetchedEvent'] = new BehaviorSubject({});

      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [{ colId: 'ag-Grid-AutoColumn' }],
          selectionFilters: {},
          columnFilters: [],
        },
        api: {
          getGridOption: () => ({ field: 'newKey' }),
        },
        success: jest.fn(),
      } as any;

      const mockResponse = {
        headMaterials: {
          rows: [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
          ],
          rowCount: 2,
        },
        childOfHeadMaterial: {},
      };

      jest.spyOn(service as any, 'fetchData').mockReturnValue(of(mockResponse));

      const dataSource = service.createCustomerMaterialPortfolioDatasource(
        { customerNumber: '123456' } as CustomerEntry,
        {} as GlobalSelectionState,
        new Map(),
        {
          setGridOption: jest.fn(),
          redrawRows: jest.fn(),
        } as any
      );

      dataSource.getRows(mockParams);

      expect(service['fetchData']).toHaveBeenCalledWith(
        mockParams.request.startRow,
        mockParams.request.endRow,
        [{ colId: 'newKey' }],
        { customerNumber: ['123456'] },
        {}
      );

      service['dataFetchedEvent'].pipe(take(1)).subscribe((result) => {
        expect(result).toEqual(mockResponse);

        expect(mockParams.success).toHaveBeenCalledWith({
          rowData: mockResponse.headMaterials.rows,
          rowCount: mockResponse.headMaterials.rowCount,
        });

        done();
      });
    });

    it('should handle group keys', async () => {
      const mockGroupKeys = ['123'];
      const mockResponse = {
        rows: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
        totalRows: 2,
      };

      jest
        .spyOn(service as any, 'getRowsForGroup')
        .mockReturnValue(of(mockResponse));

      const dataSource = service.createCustomerMaterialPortfolioDatasource(
        {} as CustomerEntry,
        {} as GlobalSelectionState,
        new Map(),
        null
      );

      dataSource.getRows({
        request: { groupKeys: mockGroupKeys, sortModel: [] },
      } as any);

      expect(service['getRowsForGroup']).toHaveBeenCalledWith({
        childMaterialsCache: new Map(),
        endRow: undefined,
        gridApi: null,
        groupKeys: ['123'],
        params: {
          request: {
            groupKeys: ['123'],
            sortModel: [],
          },
        },
        selectedCustomer: undefined,
        sortModel: [],
        startRow: undefined,
      });
    });
  });

  describe('fetchData', () => {
    it('should post request with correct parameters', async () => {
      const mockRequest = {
        startRow: 0,
        endRow: 10,
        sortModel: [],
        selectionFilters: {},
        columnFilters: [],
      } as any;

      const mockResponse = {
        rows: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
        totalRows: 2,
      };

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      const result = await lastValueFrom(
        service['fetchData'](
          mockRequest.startRow,
          mockRequest.endRow,
          mockRequest.sortModel,
          {},
          []
        )
      );

      expect(service['http'].post).toHaveBeenCalledWith(
        'api/customer-material-portfolio/',
        {
          startRow: 0,
          endRow: 10,
          sortModel: [],
          selectionFilters: {},
          columnFilters: [],
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getDataFetchedEvent', () => {
    it('should return observable of CMPResponse', () => {
      const result = service.getDataFetchedEvent();
      expect(result).toBeInstanceOf(Observable);
    });
  });

  describe('getFetchErrorEvent', () => {
    it('should return observable of any', () => {
      const result = service.getFetchErrorEvent();
      expect(result).toBeInstanceOf(Observable);
    });
  });

  describe('getRowsForGroup', () => {
    let params: any;
    let childMaterialsCache: Map<string, CMPEntry[]>;
    let groupKeys: string[];
    let sortModel: SortModelItem[];
    let selectedCustomer: string;
    let gridApi: any;

    beforeEach(() => {
      params = {
        success: jest.fn(),
        fail: jest.fn(),
      };
      childMaterialsCache = new Map();
      groupKeys = ['groupKey1'];
      sortModel = [];
      selectedCustomer = 'customer1';
      gridApi = {
        setGridOption: jest.fn(),
      };
    });

    it('should use cached data if available', () => {
      const cachedData = [{ id: 1, name: 'cachedItem' }] as any;
      childMaterialsCache.set(groupKeys[0], cachedData);

      service['getRowsForGroup']({
        childMaterialsCache,
        groupKeys,
        startRow: 0,
        endRow: 10,
        sortModel,
        selectedCustomer,
        params,
        gridApi,
      });

      expect(params.success).toHaveBeenCalledWith({
        rowData: cachedData,
        rowCount: cachedData.length,
      });
      expect(gridApi.setGridOption).toHaveBeenCalledWith('loading', false);
    });

    it('should fetch data if not available in cache', (done) => {
      const fetchedData = {
        childOfHeadMaterial: {
          groupKey1: [{ id: 2, name: 'fetchedItem' }],
        },
      };

      jest.spyOn(service as any, 'fetchData').mockReturnValue(of(fetchedData));

      service['getRowsForGroup']({
        childMaterialsCache,
        groupKeys,
        startRow: 0,
        endRow: 10,
        sortModel,
        selectedCustomer,
        params,
        gridApi,
      });

      setTimeout(() => {
        expect(service['fetchData']).toHaveBeenCalledWith(
          0,
          10,
          sortModel,
          {
            customerNumber: [selectedCustomer],
            materialNumber: [groupKeys[0]],
          },
          {}
        );
        expect(childMaterialsCache.get(groupKeys[0])).toEqual(
          (fetchedData.childOfHeadMaterial as any)[groupKeys[0]]
        );
        expect(params.success).toHaveBeenCalledWith({
          rowData: (fetchedData.childOfHeadMaterial as any)[groupKeys[0]],
          rowCount: (fetchedData.childOfHeadMaterial as any)[groupKeys[0]]
            .length,
        });
        expect(gridApi.setGridOption).toHaveBeenCalledWith('loading', false);
        done();
      });
    });

    it('should handle fetch error', (done) => {
      const mockError = new Error('Fetch error');
      jest
        .spyOn(service as any, 'fetchData')
        .mockReturnValue(throwError(() => mockError));
      jest.spyOn(service['fetchErrorEvent'], 'next');

      service['getRowsForGroup']({
        childMaterialsCache,
        groupKeys,
        startRow: 0,
        endRow: 10,
        sortModel,
        selectedCustomer,
        params,
        gridApi,
      });

      setTimeout(() => {
        expect(params.fail).toHaveBeenCalled();
        expect(service['fetchErrorEvent'].next).toHaveBeenCalledWith(mockError);
        expect(gridApi.setGridOption).toHaveBeenCalledWith('loading', false);
        done();
      });
    });
  });
});
