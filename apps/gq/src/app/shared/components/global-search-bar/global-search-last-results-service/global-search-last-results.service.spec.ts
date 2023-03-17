import { IdValue } from '@gq/shared/models/search';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { GlobalSearchLastResultsService } from './global-search-last-results.service';

describe('GlobalSearchLastResultsService', () => {
  let service: GlobalSearchLastResultsService;
  let spectator: SpectatorService<GlobalSearchLastResultsService>;

  const createService = createServiceFactory({
    service: GlobalSearchLastResultsService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(GlobalSearchLastResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addLastResult', () => {
    test('should add first item to localStorage', () => {
      service['localStorage'].setItem = jest.fn();
      service['localStorage'].getItem = jest.fn();

      service.addLastResult(
        {
          id: '093328001000012',
          value: '22309-E1-XL#E>A2',
        } as IdValue,
        '09'
      );

      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_SEARCH_LAST_RESULTS',
        JSON.stringify({
          version: 1,
          results: [
            {
              result: {
                id: '093328001000012',
                value: '22309-E1-XL#E>A2',
              },
              searchTerm: '09',
            },
          ],
        })
      );
    });

    test('should add new item to the beginning of the array', () => {
      const oldResults = [
        {
          result: {
            id: '000178349006210',
            value: 'NRB3,5X13,8-G2/-1-3#N',
          },
          searchTerm: '0001',
        },
        {
          result: {
            id: '001206109000023',
            value: 'SD25X32X4-A#N25',
          },
          searchTerm: '0012',
        },
      ];

      const newResult = {
        id: '050754700000002',
        value: 'NK90/35-XL#EN',
        selected: false,
      };

      service['localStorage'].setItem = jest.fn();
      service['localStorage'].getItem = jest.fn().mockReturnValue(
        JSON.stringify({
          version: 1,
          results: oldResults,
        })
      );

      service.addLastResult(newResult, '05');

      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_SEARCH_LAST_RESULTS',
        JSON.stringify({
          version: 1,
          results: [
            {
              result: newResult,
              searchTerm: '05',
            },
            ...oldResults,
          ],
        })
      );
    });

    test('should add new item to the start and remove oldest item if there are more then 5 results', () => {
      const oldResults = [
        {
          result: {
            id: '1111',
            value: 'NRB1',
          },
          searchTerm: '11',
        },
        {
          result: {
            id: '2222',
            value: 'NRB2',
          },
          searchTerm: '22',
        },
        {
          result: {
            id: '3333',
            value: 'NRB3',
          },
          searchTerm: '33',
        },
        {
          result: {
            id: '4444',
            value: 'NRB4',
          },
          searchTerm: '44',
        },
        {
          result: {
            id: '5555',
            value: 'NRB5',
          },
          searchTerm: '55',
        },
      ];

      const newResult = {
        id: '050754700000002',
        value: 'NK90/35-XL#EN',
      } as IdValue;

      service['localStorage'].setItem = jest.fn();
      service['localStorage'].getItem = jest.fn().mockReturnValue(
        JSON.stringify({
          version: 1,
          results: oldResults,
        })
      );

      service.addLastResult(newResult, '05');

      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_SEARCH_LAST_RESULTS',
        JSON.stringify({
          version: 1,
          results: [
            {
              result: newResult,
              searchTerm: '05',
            },
            oldResults[0],
            oldResults[1],
            oldResults[2],
            oldResults[3],
          ],
        })
      );
    });
  });

  describe('getLastResults', () => {
    test("should return an empty array if there's no results in localStorage", () => {
      // we should return null here as this is what the official localStorage API would return
      // eslint-disable-next-line unicorn/no-null
      service['localStorage'].getItem = jest.fn().mockReturnValue(null as any);

      expect(service.getLastResults()).toEqual([]);
    });

    test('should return results if there are results in localStorage', () => {
      const lastResults = [
        {
          result: {
            id: '000178349006210',
            value: 'NRB3,5X13,8-G2/-1-3#N',
          },
          searchTerm: '0001',
        },
        {
          result: {
            id: '001206109000023',
            value: 'SD25X32X4-A#N25',
          },
          searchTerm: '0012',
        },
      ];
      service['localStorage'].getItem = jest.fn().mockReturnValue(
        JSON.stringify({
          version: 1,
          results: lastResults,
        })
      );

      const results = service.getLastResults();

      expect(results).toEqual([
        {
          id: '000178349006210',
          value: 'NRB3,5X13,8-G2/-1-3#N',
        },
        {
          id: '001206109000023',
          value: 'SD25X32X4-A#N25',
        },
      ]);
    });
  });

  describe('getLastSearchTerms', () => {
    test("should return an empty array if there's no results in localStorage", () => {
      // we should return null here as this is what the official localStorage API would return
      // eslint-disable-next-line unicorn/no-null
      service['localStorage'].getItem = jest.fn().mockReturnValue(null as any);

      expect(service.getLastSearchTerms()).toEqual([]);
    });

    test('should return results if there are results in localStorage', () => {
      const lastResults = [
        {
          result: {
            id: '000178349006210',
            value: 'NRB3,5X13,8-G2/-1-3#N',
          },
          searchTerm: '0001',
        },
        {
          result: {
            id: '001206109000023',
            value: 'SD25X32X4-A#N25',
          },
          searchTerm: '0012',
        },
      ];
      service['localStorage'].getItem = jest.fn().mockReturnValue(
        JSON.stringify({
          version: 1,
          results: lastResults,
        })
      );

      const results = service.getLastSearchTerms();

      expect(results).toEqual(['0001', '0012']);
    });
  });

  describe('removeResult', () => {
    test('should remove result from localStorage', () => {
      service['localStorage'].setItem = jest.fn();
      const lastResults = [
        {
          result: {
            id: '000178349006210',
            value: 'NRB3,5X13,8-G2/-1-3#N',
          },
          searchTerm: '0001',
        },
        {
          result: {
            id: '001206109000023',
            value: 'SD25X32X4-A#N25',
          },
          searchTerm: '0012',
        },
        {
          result: {
            id: '050754700000002',
            value: 'NK90/35-XL#EN',
          },
          searchTerm: 'NK90',
        },
      ];
      service['localStorage'].getItem = jest.fn().mockReturnValue(
        JSON.stringify({
          version: 1,
          results: lastResults,
        })
      );

      service.removeResult(lastResults[1].result as IdValue);

      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_SEARCH_LAST_RESULTS',
        JSON.stringify({
          version: 1,
          results: [lastResults[0], lastResults[2]],
        })
      );
    });
  });
});
