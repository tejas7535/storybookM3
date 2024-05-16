import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { ColumnUtilityService } from '../column-utility.service';
import { ComparatorService } from '../comparator.service';
import { DateFilterParamService } from './date-filter-param.service';

describe('DateFilterParamService', () => {
  let service: DateFilterParamService;
  let spectator: SpectatorService<DateFilterParamService>;

  const createService = createServiceFactory({
    service: DateFilterParamService,
    providers: [
      MockProvider(ColumnUtilityService, {
        dateFormatter: jest.fn(),
      }),
      MockProvider(ComparatorService, {
        compareTranslocoDateDesc: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('TEXT_COLUMN_FILTER', () => {
    test('should not call dateFormatter', () => {
      const textColumnFilter = service.DATE_FILTER_PARAMS.filters[0];

      const result = textColumnFilter.filterParams.textFormatter('2021-01-01');

      expect(result).toEqual('2021-01-01');
    });
    test('should call dateFormatter', () => {
      const textColumnFilter = service.DATE_FILTER_PARAMS.filters[0];

      textColumnFilter.filterParams.textFormatter(
        '2024-05-16T12:34:56.123456Z'
      );

      expect(service['columnUtilityService'].dateFormatter).toHaveBeenCalled();
    });
  });
  describe('SET_COLUMN_FILTER', () => {
    test('should call compareTranslocoDateDesc', () => {
      const setColumnFilter = service.DATE_FILTER_PARAMS.filters[1];

      setColumnFilter.filterParams.comparator('2021-01-01', '2021-01-02');

      expect(
        service['comparatorService'].compareTranslocoDateDesc
      ).toHaveBeenCalled();
    });
  });
});
