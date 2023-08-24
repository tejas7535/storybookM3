import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { StringOption } from '@schaeffler/inputs';

import { SearchUtilityService } from './search-utility.service';

describe('SearchUtilityService', () => {
  let service: SearchUtilityService;
  let spectator: SpectatorService<SearchUtilityService>;

  const createService = createServiceFactory(SearchUtilityService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(SearchUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mergeOptionsWithSelectedOptions', () => {
    it('should add selected options to provided options', () => {
      const selectedOptions = [
        { id: '001', title: 'already selected option 1' } as StringOption,
        { id: '002', title: 'already selected option 2' } as StringOption,
      ];

      const options = [
        { id: '004', title: 'new' } as StringOption,
        { id: '002', title: 'already selected option 2' } as StringOption,
      ];

      const result = service.mergeOptionsWithSelectedOptions(
        options,
        selectedOptions
      );

      expect(result).toEqual([
        { id: '001', title: 'already selected option 1' } as StringOption,
        { id: '002', title: 'already selected option 2' } as StringOption,
        { id: '004', title: 'new' } as StringOption,
      ]);
    });
  });
});
