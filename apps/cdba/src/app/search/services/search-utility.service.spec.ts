import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { IdValue } from '../../core/store/reducers/search/models';
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
        new IdValue('001', 'already selected option 1', true),
        new IdValue('002', 'already selected option 2', false),
      ];

      const options = [
        new IdValue('004', 'new', true),
        new IdValue('002', 'already selected option 2', false),
      ];

      const result = service.mergeOptionsWithSelectedOptions(
        options,
        selectedOptions
      );

      expect(result).toEqual([
        new IdValue('004', 'new', true),
        new IdValue('002', 'already selected option 2', true),
        new IdValue('001', 'already selected option 1', true),
      ]);
    });
  });
});
