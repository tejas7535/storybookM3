import { HttpClient, HttpParams } from '@angular/common/http';

import { of, take, throwError } from 'rxjs';

import {
  FilterModel,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  SortModelItem,
} from 'ag-grid-enterprise';

import { Stub } from '../../shared/test/stub.class';
import { HttpError } from '../../shared/utils/http-client';
import { OverviewService } from './overview.service';

describe('OverviewService', () => {
  let service: OverviewService;
  let httpClient: HttpClient;
  const testCurrency = 'EUR';

  beforeEach(() => {
    service = Stub.get<OverviewService>({
      component: OverviewService,
    });
    httpClient = service['http'];
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getSalesPlanningOverview', () => {
    it('should request data from the server', (done) => {
      const postSpy = jest.spyOn(httpClient, 'post');
      jest
        .spyOn(service['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of(testCurrency));

      const isAssignedToMe = true;
      const requestParams = {
        startRow: 0,
        endRow: 100,
        filterModel: [] as FilterModel[],
        sortModel: [] as SortModelItem[],
      };
      const httpParams: HttpParams = new HttpParams()
        .set('isCustomerNumberAssignedToMe', isAssignedToMe)
        .set('currency', testCurrency);
      service
        .getSalesPlanningOverview(
          requestParams,
          isAssignedToMe,
          ['gkam1'],
          ['customer1']
        )
        .pipe(take(1))
        .subscribe(() => {
          expect(postSpy).toHaveBeenCalledWith(
            service['SALES_PLANNING_OVERVIEW_API'],
            {
              startRow: 0,
              endRow: 100,
              sortModel: [],
              columnFilters: [{}],
              selectionFilters: {
                customerNumber: ['customer1'],
                keyAccountNumber: ['gkam1'],
              },
            },
            expect.objectContaining({ params: httpParams })
          );
          done();
        });
    });
  });

  describe('createCustomerSalesPlanningDatasource', () => {
    it('create a sales planning overview datasource', () => {
      const params = {
        request: {} as IServerSideGetRowsRequest,
        success: jest.fn(),
      } as unknown as IServerSideGetRowsParams;

      jest
        .spyOn(service, 'getSalesPlanningOverview')
        .mockReturnValue(of({ rows: [], rowCount: 0 }));
      const datasource = service.createCustomerSalesPlanningDatasource(
        true,
        [],
        []
      );
      datasource.getRows(params);
      expect(params.success).toHaveBeenCalledWith({ rowData: [], rowCount: 0 });
    });

    it('should emit an error on SAP error 133', () => {
      const params = {
        request: {} as IServerSideGetRowsRequest,
        success: jest.fn(),
      } as unknown as IServerSideGetRowsParams;

      jest
        .spyOn(service as any, 'getSalesPlanningOverview')
        .mockImplementation(() =>
          throwError(
            () =>
              new HttpError(400, { values: { 'x-sap-messagenumber': '133' } })
          )
        );

      const datasource = service.createCustomerSalesPlanningDatasource(
        true,
        [],
        []
      );
      datasource.getRows(params);
      expect(params.success).toHaveBeenCalledWith({ rowData: [], rowCount: 0 });
      expect(service.getFetchErrorEvent().value).toEqual({
        message: 'hint.selectData',
      });
    });
  });
});
