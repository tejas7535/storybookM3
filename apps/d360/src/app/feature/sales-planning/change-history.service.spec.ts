import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { BackendTableResponse } from '../../shared/components/table';
import { Stub } from '../../shared/test/stub.class';
import { ChangeHistoryService } from './change-history.service';

describe('ChangeHistoryService', () => {
  let service: ChangeHistoryService;
  let httpClient: HttpClient;

  beforeEach(() => {
    service = Stub.get({ component: ChangeHistoryService });
    httpClient = service['http'];
  });

  describe('getChangeHistory', () => {
    it('should call HttpClient.post with the correct URL and payload', (done) => {
      // Arrange
      const mockParams = {
        startRow: 0,
        endRow: 10,
        sortModel: [{ colId: 'name', sort: 'asc' }],
        columnFilters: [{ colId: 'status', filter: 'active' }],
      } as any;
      const mockSelectionFilters = { customerNumber: ['12345'] };
      const mockResponse: BackendTableResponse = { rows: [], rowCount: 0 };

      jest.spyOn(httpClient, 'post').mockReturnValue(of(mockResponse));

      // Act
      service
        .getChangeHistory(mockParams, mockSelectionFilters)
        .subscribe((response) => {
          // Assert
          expect(httpClient.post).toHaveBeenCalledWith(
            '/api/sales-planning/detailed-customer-sales-plan/change-history',
            {
              startRow: mockParams.startRow,
              endRow: mockParams.endRow,
              sortModel: mockParams.sortModel,
              selectionFilters: mockSelectionFilters,
              columnFilters: mockParams.columnFilters,
            }
          );
          expect(response).toEqual(mockResponse);
          done();
        });
    });

    it('should handle empty parameters gracefully', (done) => {
      // Arrange
      const mockParams = {
        startRow: undefined,
        endRow: undefined,
        sortModel: undefined,
        columnFilters: undefined,
      } as any;
      const mockSelectionFilters = {};
      const mockResponse: BackendTableResponse = { rows: [], rowCount: 0 };

      jest.spyOn(httpClient, 'post').mockReturnValue(of(mockResponse));

      // Act
      service
        .getChangeHistory(mockParams as any, mockSelectionFilters)
        .subscribe((response) => {
          // Assert
          expect(httpClient.post).toHaveBeenCalledWith(
            '/api/sales-planning/detailed-customer-sales-plan/change-history',
            {
              startRow: undefined,
              endRow: undefined,
              sortModel: undefined,
              selectionFilters: mockSelectionFilters,
              columnFilters: undefined,
            }
          );
          expect(response).toEqual(mockResponse);
          done();
        });
    });

    it('should return the response from HttpClient.post', (done) => {
      // Arrange
      const mockParams = {
        startRow: 0,
        endRow: 10,
        sortModel: [],
        columnFilters: [],
      } as any;
      const mockSelectionFilters = { customerNumber: ['12345'] };
      const mockResponse: BackendTableResponse = {
        rows: [{ id: 1 }],
        rowCount: 1,
      };

      jest.spyOn(httpClient, 'post').mockReturnValue(of(mockResponse));

      // Act
      service
        .getChangeHistory(mockParams, mockSelectionFilters)
        .subscribe((response) => {
          // Assert
          expect(response).toEqual(mockResponse);
          done();
        });
    });
  });
});
