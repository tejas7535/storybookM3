import { HttpParams, provideHttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  isEmpty,
  lastValueFrom,
  Observable,
  of,
  take,
  throwError,
} from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { CustomerEntry } from '../global-selection/model';
import { CMPService } from './cmp.service';

describe('CMPService', () => {
  let spectator: SpectatorService<CMPService>;

  const createService = createServiceFactory({
    service: CMPService,
    providers: [provideHttpClient()],
  });

  beforeEach(() => (spectator = createService()));

  describe('getForecastActionData', () => {
    it('should return success response when valid cmpData is provided', (done) => {
      const mockResponse = {
        overallStatus: 'SUCCESS',
        overallErrorMsg: null,
        response: [{ id: 1, name: 'Test' }],
      } as any;

      jest
        .spyOn(spectator.service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      spectator.service
        .getForecastActionData({
          customerNumber: '123',
          materialNumber: '456',
          successorMaterial: '789',
        } as any)
        .pipe(take(1))
        .subscribe((result) => {
          expect(spectator.service['http'].post).toHaveBeenCalledWith(
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
      const result = spectator.service.getForecastActionData(null);

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
        .spyOn(spectator.service['http'] as any, 'get')
        .mockReturnValue(of(mockResponse));

      spectator.service
        .getCMPCriteriaData()
        .pipe(take(1))
        .subscribe((result) => {
          expect(spectator.service['http'].get).toHaveBeenCalledWith(
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
        .spyOn(spectator.service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      spectator.service
        .saveBulkPhaseIn(mockRequest, true)
        .pipe(take(1))
        .subscribe((result) => {
          expect(spectator.service['http'].post).toHaveBeenCalledWith(
            'api/customer-material-portfolio/bulk-phase-in',
            mockRequest,
            { params: new HttpParams().set('dryRun', 'true') }
          );
          expect(result).toEqual({
            overallStatus: 'SUCCESS',
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
        .spyOn(spectator.service['http'] as any, 'post')
        .mockReturnValue(throwError(() => mockError));

      const result = await lastValueFrom(
        spectator.service.saveBulkPhaseIn({} as any, false)
      ).catch((error) => error);

      expect(result).toEqual({
        overallStatus: 'ERROR',
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
        .spyOn(spectator.service['http'] as any, 'post')
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

      spectator.service
        .saveCMPChange(cmpData, false, 'action-url')
        .pipe(take(1))
        .subscribe((result) => {
          expect(spectator.service['http'].post).toHaveBeenCalledWith(
            'api/customer-material-portfolio/action-url',
            cmpData,
            { params: { dryRun: 'false' } }
          );
          expect(result).toEqual({
            overallStatus: 'WARNING',
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

      spectator.service
        .saveCMPChange(cmpData, false, null)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'ERROR',
            overallErrorMsg: 'error.unknown',
            response: [],
          });

          done();
        });
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new Error('HTTP error occurred');
      jest
        .spyOn(spectator.service['http'] as any, 'post')
        .mockReturnValue(throwError(() => mockError));

      const cmpData = {
        customerNumber: '123',
        materialNumber: '456',
        successorMaterial: '789',
        portfolioStatus: 'SE',
      } as any;

      spectator.service
        .saveCMPChange(cmpData, false, 'action-url')
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'ERROR',
            overallErrorMsg: mockError.message,
            response: [],
          });

          done();
        });
    });
  });

  describe('createCustomerMaterialPortfolioDatasource', () => {
    it('should fetch data with correct parameters', (done) => {
      (spectator.service as any)['dataFetchedEvent'] = new BehaviorSubject({});

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

      jest
        .spyOn(spectator.service as any, 'fetchData')
        .mockReturnValue(of(mockResponse));

      const dataSource =
        spectator.service.createCustomerMaterialPortfolioDatasource(
          { customerNumber: '123456' } as CustomerEntry,
          {} as GlobalSelectionState,
          new Map(),
          {
            setGridOption: jest.fn(),
            redrawRows: jest.fn(),
          } as any
        );

      dataSource.getRows(mockParams);

      expect(spectator.service['fetchData']).toHaveBeenCalledWith(
        mockParams.request.startRow,
        mockParams.request.endRow,
        [{ colId: 'newKey' }],
        { customerNumber: ['123456'] },
        {}
      );

      spectator.service['dataFetchedEvent']
        .pipe(take(1))
        .subscribe((result) => {
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
        .spyOn(spectator.service as any, 'getRowsForGroup')
        .mockReturnValue(of(mockResponse));

      const dataSource =
        spectator.service.createCustomerMaterialPortfolioDatasource(
          {} as CustomerEntry,
          {} as GlobalSelectionState,
          new Map(),
          null
        );

      dataSource.getRows({
        request: { groupKeys: mockGroupKeys, sortModel: [] },
      } as any);

      expect(spectator.service['getRowsForGroup']).toHaveBeenCalledWith({
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
        .spyOn(spectator.service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      const result = await lastValueFrom(
        spectator.service['fetchData'](
          mockRequest.startRow,
          mockRequest.endRow,
          mockRequest.sortModel,
          {},
          []
        )
      );

      expect(spectator.service['http'].post).toHaveBeenCalledWith(
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
      const result = spectator.service.getDataFetchedEvent();
      expect(result).toBeInstanceOf(Observable);
    });
  });

  describe('getFetchErrorEvent', () => {
    it('should return observable of any', () => {
      const result = spectator.service.getFetchErrorEvent();
      expect(result).toBeInstanceOf(Observable);
    });
  });
});
