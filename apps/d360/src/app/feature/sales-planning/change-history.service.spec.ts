import { HttpClient } from '@angular/common/http';

import { of, take } from 'rxjs';

import {
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
} from 'ag-grid-enterprise';

import { PaginatedFilteredResponse } from '../../shared/models/paginated-filtered-request';
import { Stub } from '../../shared/test/stub.class';
import { ChangeHistoryService } from './change-history.service';
import { ChangeHistoryData } from './model';

describe('ChangeHistoryService', () => {
  let service: ChangeHistoryService;
  let httpClient: HttpClient;
  let postSpy: jest.SpyInstance;
  beforeEach(() => {
    service = Stub.get({ component: ChangeHistoryService });
    httpClient = service['http'];
    postSpy = jest.spyOn(httpClient, 'post');
  });
  describe('getChangeHistory', () => {
    it('should request the change history data', (done) => {
      service
        .getChangeHistory(
          {
            startRow: 1,
            endRow: 100,
            filterModel: {},
            sortModel: [],
          },
          '0000023226'
        )
        .pipe(take(1))
        .subscribe(() => {
          expect(postSpy).toHaveBeenCalledWith(service['CHANGE_HISTORY_API'], {
            columnFilters: [{}],
            endRow: 100,
            selectionFilters: { customerNumber: ['0000023226'] },
            sortModel: [],
            startRow: 1,
          });
          done();
        });
    });
  });

  describe('createChangeHistoryDatasource', () => {
    it('should create a datasource for the change history', (done) => {
      const params = {
        request: {} as IServerSideGetRowsRequest,
        success: jest.fn(),
      } as unknown as IServerSideGetRowsParams;
      jest
        .spyOn(service, 'getChangeHistory')
        .mockReturnValue(of({ rows: [{} as ChangeHistoryData], rowCount: 1 }));
      const datasource = service.createChangeHistoryDatasource('0000023226');
      datasource.getRows(params);
      expect(params.success).toHaveBeenCalledWith({
        rowCount: 1,
        rowData: [{}],
      });
      service.dataChangedEvent
        .pipe(take(1))
        .subscribe((data: PaginatedFilteredResponse<ChangeHistoryData>) => {
          expect(data).toEqual({ rows: [{}], rowCount: 1 });
          done();
        });
    });
  });
});
