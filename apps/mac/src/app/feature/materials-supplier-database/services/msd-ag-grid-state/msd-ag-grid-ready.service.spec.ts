import { Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import {
  ColumnApi,
  GridApi,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';

import {
  SAPMaterial,
  SAPMaterialsRequest,
  SAPMaterialsResponse,
} from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

import { MsdAgGridReadyService } from './msd-ag-grid-ready.service';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('MsdAgGridStateService', () => {
  let spectator: SpectatorService<MsdAgGridReadyService>;
  let service: MsdAgGridReadyService;
  let facade: DataFacade;

  const createService = createServiceFactory({
    service: MsdAgGridReadyService,
    providers: [
      {
        provide: DataFacade,
        useValue: {
          sapResult$: new Subject<{
            lastRow?: number;
            totalRows?: number;
            subTotalRows?: number;
            startRow: number;
            data: SAPMaterial[];
          }>(),
          fetchSAPMaterials: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    facade = spectator.inject(DataFacade);
    facade.sapResult$ = new Subject<{
      lastRow?: number;
      totalRows?: number;
      subTotalRows?: number;
      startRow: number;
      data: SAPMaterial[];
    }>();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('subscribe should subscribe to updates', () => {
    let fail = true;
    service.agGridApi$.subscribe(() => (fail = false));
    service.agGridApiready({} as GridApi, {} as ColumnApi);
    expect(fail).toBe(false);
  });

  describe('should react to sapResult$', () => {
    const mockSubject = new Subject<{
      lastRow?: number;
      totalRows?: number;
      subTotalRows?: number;
      startRow: number;
      data: SAPMaterial[];
    }>();

    const mockResultFailureBase: {
      lastRow?: number;
      totalRows?: number;
      subTotalRows?: number;
      startRow: number;
      data: SAPMaterial[];
    } = {
      startRow: 0,
      data: undefined,
    };
    const mockResultSuccessBase: {
      lastRow?: number;
      totalRows?: number;
      subTotalRows?: number;
      startRow: number;
      data: SAPMaterial[];
    } = {
      lastRow: -1,
      totalRows: 300,
      subTotalRows: 100,
      startRow: 0,
      data: [{} as SAPMaterial],
    };

    beforeEach(() => {
      facade.sapResult$ = mockSubject;
    });
    it('should do nothing if serverSideParamsStore size is 0', () => {
      service['paramSuccess'] = jest.fn();
      service['paramFailure'] = jest.fn();

      mockSubject.next(mockResultFailureBase);

      expect(service['paramSuccess']).not.toHaveBeenCalled();
      expect(service['paramFailure']).not.toHaveBeenCalled();
    });
    it('should do nothing if result is undefined', () => {
      service['serverSideParamsStore'].set(1, {} as IServerSideGetRowsParams);
      service['paramSuccess'] = jest.fn();
      service['paramFailure'] = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      mockSubject.next(undefined);

      expect(service['paramSuccess']).not.toHaveBeenCalled();
      expect(service['paramFailure']).not.toHaveBeenCalled();
    });

    it('should call success function on defined result', () => {
      service['serverSideParamsStore'].set(0, {} as IServerSideGetRowsParams);
      service['paramSuccess'] = jest.fn();
      service['paramFailure'] = jest.fn();

      mockSubject.next(mockResultSuccessBase);

      expect(service['paramSuccess']).toHaveBeenCalledWith(
        {},
        mockResultSuccessBase as SAPMaterialsResponse
      );
      expect(service['paramFailure']).not.toHaveBeenCalled();
    });

    it('should call fail function on undefined result data', () => {
      service['serverSideParamsStore'].set(0, {} as IServerSideGetRowsParams);
      service['paramSuccess'] = jest.fn();
      service['paramFailure'] = jest.fn();

      mockSubject.next(mockResultFailureBase);

      expect(service['paramSuccess']).not.toHaveBeenCalled();
      expect(service['paramFailure']).toHaveBeenCalled();
    });
  });

  describe('setParams', () => {
    it('should set the params', () => {
      const mockParams = {
        request: { startRow: 0 } as SAPMaterialsRequest,
      } as IServerSideGetRowsParams;
      service['serverSideParamsStore'].set = jest.fn();

      service.setParams(mockParams);

      expect(facade.fetchSAPMaterials).toHaveBeenCalledWith({
        startRow: 0,
      } as SAPMaterialsRequest);
      expect(service['serverSideParamsStore'].set).toHaveBeenCalledWith(
        0,
        mockParams
      );
    });
  });

  describe('unsetParams', () => {
    it('should unset the params', () => {
      service['serverSideParamsStore'].clear = jest.fn();

      service.unsetParams();

      expect(service['serverSideParamsStore'].clear).toHaveBeenCalled();
    });
  });

  describe('paramSuccess', () => {
    it('should call success function of params', () => {
      const mockParams = {
        request: { startRow: 0 },
        success: jest.fn(),
      } as unknown as IServerSideGetRowsParams;
      service['serverSideParamsStore'].delete = jest.fn();

      const mockResult = {
        data: [],
        subTotalRows: 100,
      } as SAPMaterialsResponse;

      service['paramSuccess'](mockParams, mockResult);

      expect(service['serverSideParamsStore'].delete).toHaveBeenCalledWith(0);
      expect(mockParams.success).toHaveBeenCalledWith({
        rowData: mockResult.data,
        rowCount: mockResult.subTotalRows,
      });
    });
  });

  describe('paramFailure', () => {
    it('should call fail function of params', () => {
      const mockParams = {
        request: { startRow: 0 },
        fail: jest.fn(),
      } as unknown as IServerSideGetRowsParams;
      service['serverSideParamsStore'].delete = jest.fn();
      service['dataFacade'].errorSnackBar = jest.fn();

      service['paramFailure'](mockParams, 404, 0);

      expect(service['serverSideParamsStore'].delete).toHaveBeenCalledWith(0);
      expect(service['dataFacade'].errorSnackBar).toHaveBeenCalled();
      expect(mockParams.fail).toHaveBeenCalled();
    });
    it('should retry data load', () => {
      const mockParams = {
        request: { startRow: 0 },
        fail: jest.fn(),
      } as unknown as IServerSideGetRowsParams;
      service['dataFacade'].errorSnackBar = jest.fn();
      service['serverSideParamsStore'].delete = jest.fn();

      service['paramFailure'](mockParams, 0, 0);

      expect(service['dataFacade'].errorSnackBar).toHaveBeenCalled();
      expect(service['serverSideParamsStore'].delete).not.toHaveBeenCalled();
    });
  });
});
