import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { IServerSideGetRowsParams } from '@ag-grid-community/all-modules';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../environments/environment';
import { SalesSummary } from '../core/store/reducers/sales-summary/models/sales-summary.model';
import { DataService } from './data.service';
import { FilterType } from './enums/filter-type.enum';
import { requestParamsMock } from './mocks/request-params.mock';
import { Page } from './models/page.model';

describe('DataService', () => {
  let dataService: DataService;
  let spectator: SpectatorService<DataService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: DataService,
    imports: [HttpClientTestingModule],
    providers: [DataService],
  });

  beforeEach(() => {
    spectator = createService();
    dataService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(dataService).toBeTruthy();
  });

  describe('buildFilterParamKey', () => {
    it('should return correct param key', () => {
      expect(
        DataService['buildFilterParamKey']('filterKey', FilterType.FILTER)
      ).toEqual(`${FilterType.FILTER}FilterKey`);
    });
  });

  describe('addSortParams', () => {
    it('should do nothing if no sort params given', () => {
      const serverSideGetRowParams: IServerSideGetRowsParams = {
        api: undefined,
        parentNode: undefined,
        successCallback: undefined,
        failCallback: undefined,
        columnApi: undefined,
        request: requestParamsMock,
      };

      expect(
        DataService['addSortParams'](new HttpParams(), serverSideGetRowParams)
      ).toEqual(new HttpParams());
    });

    it('should add sort param', () => {
      const requestParams = { ...requestParamsMock };
      requestParams.sortModel = [
        {
          colId: 'categoryNetSales',
          sort: 'asc',
        },
      ];

      const serverSideGetRowParams: IServerSideGetRowsParams = {
        api: undefined,
        parentNode: undefined,
        successCallback: undefined,
        failCallback: undefined,
        columnApi: undefined,
        request: requestParams,
      };

      let expectedHttpParams = new HttpParams();
      expectedHttpParams = expectedHttpParams.set(
        'sortCategoryNetSales',
        'ASC'
      );

      expect(
        DataService['addSortParams'](new HttpParams(), serverSideGetRowParams)
      ).toEqual(expectedHttpParams);
    });
  });

  describe('addFilterParams', () => {
    it('should do nothing when no filter params given', () => {
      DataService['buildFilterParamKey'] = jest.fn();

      const serverSideGetRowParams: IServerSideGetRowsParams = {
        api: undefined,
        parentNode: undefined,
        successCallback: undefined,
        failCallback: undefined,
        columnApi: undefined,
        request: requestParamsMock,
      };

      expect(
        DataService['addFilterParams'](new HttpParams(), serverSideGetRowParams)
      ).toEqual(new HttpParams());
      expect(DataService['buildFilterParamKey']).toHaveBeenCalledTimes(0);
    });

    it('should do nothing when not valid filter type set', () => {
      DataService['buildFilterParamKey'] = jest.fn();

      const requestParams = { ...requestParamsMock };
      requestParams.filterModel = {
        sectorKey: {
          filterType: 'text',
          type: 'ABC',
          filter: 'abc filter',
        },
      };

      const serverSideGetRowParams: IServerSideGetRowsParams = {
        api: undefined,
        parentNode: undefined,
        successCallback: undefined,
        failCallback: undefined,
        columnApi: undefined,
        request: requestParams,
      };

      expect(
        DataService['addFilterParams'](new HttpParams(), serverSideGetRowParams)
      ).toEqual(new HttpParams());
      expect(DataService['buildFilterParamKey']).toHaveBeenCalledTimes(0);
    });

    it('should add (text)filter param', () => {
      DataService['buildFilterParamKey'] = jest
        .fn()
        .mockReturnValue(`${FilterType.FILTER}SectorKey`);

      const requestParams = { ...requestParamsMock };
      requestParams.filterModel = {
        sectorKey: {
          filterType: 'text',
          type: 'equals',
          filter: 'abc filter',
        },
      };

      const serverSideGetRowParams: IServerSideGetRowsParams = {
        api: undefined,
        parentNode: undefined,
        successCallback: undefined,
        failCallback: undefined,
        columnApi: undefined,
        request: requestParams,
      };

      let expectedHttpParams = new HttpParams();
      expectedHttpParams = expectedHttpParams.set(
        'filterSectorKey',
        'abc filter'
      );

      expect(
        DataService['addFilterParams'](new HttpParams(), serverSideGetRowParams)
      ).toEqual(expectedHttpParams);

      expect(DataService['buildFilterParamKey']).toHaveBeenCalledTimes(1);
      expect(DataService['buildFilterParamKey']).toHaveBeenCalledWith(
        'sectorKey',
        FilterType.FILTER
      );
    });

    it('should add (date range)filter param', () => {
      DataService['buildFilterParamKey'] = jest
        .fn()
        .mockReturnValue(`${FilterType.DATE_RANGE}LastUpdated`);

      const requestParams = { ...requestParamsMock };
      requestParams.filterModel = {
        lastUpdated: {
          filterType: 'date',
          type: 'inRange',
          dateTo: '2020-10-22 00:00:00',
          dateFrom: '2020-10-21 00:00:00',
        },
      };

      const serverSideGetRowParams: IServerSideGetRowsParams = {
        api: undefined,
        parentNode: undefined,
        successCallback: undefined,
        failCallback: undefined,
        columnApi: undefined,
        request: requestParams,
      };

      let expectedHttpParams = new HttpParams();
      expectedHttpParams = expectedHttpParams.set(
        'dateRangeLastUpdated',
        '2020-10-21T00:00:00.000Z|2020-10-22T00:00:00.000Z'
      );

      expect(
        DataService['addFilterParams'](new HttpParams(), serverSideGetRowParams)
      ).toEqual(expectedHttpParams);

      expect(DataService['buildFilterParamKey']).toHaveBeenCalledTimes(1);
      expect(DataService['buildFilterParamKey']).toHaveBeenCalledWith(
        'lastUpdated',
        FilterType.DATE_RANGE
      );
    });

    it('should add (date range)filter and (text) filter param', () => {
      DataService['buildFilterParamKey'] = jest
        .fn()
        .mockReturnValueOnce(`${FilterType.DATE_RANGE}LastUpdated`)
        .mockReturnValueOnce(`${FilterType.FILTER}SectorKey`);

      const requestParams = { ...requestParamsMock };
      requestParams.filterModel = {
        lastUpdated: {
          filterType: 'date',
          type: 'inRange',
          dateTo: '2020-10-22 00:00:00',
          dateFrom: '2020-10-21 00:00:00',
        },
        sectorKey: {
          filterType: 'text',
          type: 'equals',
          filter: 'abc filter',
        },
      };

      const serverSideGetRowParams: IServerSideGetRowsParams = {
        api: undefined,
        parentNode: undefined,
        successCallback: undefined,
        failCallback: undefined,
        columnApi: undefined,
        request: requestParams,
      };

      let expectedHttpParams = new HttpParams();
      expectedHttpParams = expectedHttpParams.set(
        'dateRangeLastUpdated',
        '2020-10-21T00:00:00.000Z|2020-10-22T00:00:00.000Z'
      );
      expectedHttpParams = expectedHttpParams.set(
        'filterSectorKey',
        'abc filter'
      );

      expect(
        DataService['addFilterParams'](new HttpParams(), serverSideGetRowParams)
      ).toEqual(expectedHttpParams);

      expect(DataService['buildFilterParamKey']).toHaveBeenCalledTimes(2);
      expect(DataService['buildFilterParamKey']).toHaveBeenCalledWith(
        'lastUpdated',
        FilterType.DATE_RANGE
      );
      expect(DataService['buildFilterParamKey']).toHaveBeenCalledWith(
        'sectorKey',
        FilterType.FILTER
      );
    });
  });

  describe('getSalesSummary', () => {
    it('should return response', (done) => {
      const expectedResponse: Page<SalesSummary> = {
        content: [],
        pageNumber: 0,
        pageSize: 0,
        totalItemsCount: 0,
        totalPageCount: 0,
      };

      const url = `${environment.apiBaseUrl}/sales`;

      dataService.getSalesSummary().subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(expectedResponse);
    });
  });

  describe('getSalesSummaryPromise', () => {
    it(
      'should return response',
      waitForAsync(() => {
        const serverSideGetRowParams: IServerSideGetRowsParams = {
          api: undefined,
          parentNode: undefined,
          successCallback: undefined,
          failCallback: undefined,
          columnApi: undefined,
          request: requestParamsMock,
        };

        const expectedResponse: Page<SalesSummary> = {
          content: [],
          pageNumber: 0,
          pageSize: 0,
          totalItemsCount: 0,
          totalPageCount: 0,
        };

        const url = `${environment.apiBaseUrl}/sales?pageNumber=0`;

        DataService['addFilterParams'] = jest
          .fn()
          .mockReturnValue(new HttpParams());
        DataService['addSortParams'] = jest
          .fn()
          .mockReturnValue(new HttpParams());

        dataService
          .getSalesSummaryPromise(serverSideGetRowParams)
          .then((response) => {
            expect(response).toEqual(expectedResponse);

            expect(DataService['addFilterParams']).toHaveBeenCalledTimes(1);
            expect(DataService['addFilterParams']).toHaveBeenCalledWith(
              new HttpParams(),
              serverSideGetRowParams
            );

            expect(DataService['addSortParams']).toHaveBeenCalledTimes(1);
            expect(DataService['addSortParams']).toHaveBeenCalledWith(
              new HttpParams(),
              serverSideGetRowParams
            );
          });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('GET');
        req.flush(expectedResponse);
      })
    );
  });
});
