import { of, take } from 'rxjs';

import { Stub } from '../../shared/test/stub.class';
import { OverviewService } from './overview.service';

describe('OverviewService', () => {
  let service: OverviewService;

  beforeEach(() => {
    service = Stub.get<OverviewService>({
      component: OverviewService,
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getRelevantPlanningKPIs', () => {
    it('should call the API with the correct parameters and return the response', (done) => {
      const httpSpy = jest.spyOn(service['http'], 'post').mockReturnValue(
        of({
          rows: [{ id: 1, name: 'KPI A' }],
          rowCount: 1,
        })
      );

      const currencySpy = jest
        .spyOn(service['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of('USD'));

      const selectionFilters = {
        keyAccountNumber: ['KA1'],
        customerNumber: ['C1'],
      };
      const isAssignedToMe = true;
      const params = {
        startRow: 0,
        endRow: 10,
        sortModel: [{ colId: 'name', sort: 'asc' }],
        columnFilters: { columnKey: 'columnValue' },
      } as any;

      service
        .getRelevantPlanningKPIs(selectionFilters, isAssignedToMe, params)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            rows: [{ id: 1, name: 'KPI A' }],
            rowCount: 1,
          });

          expect(currencySpy).toHaveBeenCalled();
          expect(httpSpy).toHaveBeenCalledWith(
            'api/sales-planning/overview',
            {
              startRow: 0,
              endRow: 10,
              sortModel: [{ colId: 'name', sort: 'asc' }],
              selectionFilters,
              columnFilters: { columnKey: 'columnValue' },
            },
            {
              params: expect.objectContaining({
                updates: expect.arrayContaining([
                  expect.objectContaining({
                    param: 'isCustomerNumberAssignedToMe',
                    value: true,
                  }),
                  expect.objectContaining({
                    param: 'currency',
                    value: 'USD',
                  }),
                ]),
              }),
              context: expect.any(Object),
            }
          );

          done();
        });
    });

    it('should handle an empty response gracefully', (done) => {
      jest.spyOn(service['http'], 'post').mockReturnValue(
        of({
          rows: [],
          rowCount: 0,
        })
      );

      jest
        .spyOn(service['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of('EUR'));

      service
        .getRelevantPlanningKPIs(
          { keyAccountNumber: [], customerNumber: [] },
          false,
          { startRow: 0, endRow: 10, sortModel: [], columnFilters: {} } as any
        )
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            rows: [],
            rowCount: 0,
          });
          done();
        });
    });
  });
});
