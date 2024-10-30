import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';

import { SelectableOptionsService } from './selectable-options.service';

describe('SelectableOptionsService', () => {
  let spectator: SpectatorHttp<SelectableOptionsService>;

  const createHttp = createHttpFactory({
    service: SelectableOptionsService,
  });

  beforeEach(() => {
    spectator = createHttp();
  });

  it('should fetch data on init', () => {
    expect(spectator.service).toBeTruthy();
    spectator.expectConcurrent([
      {
        url: 'api/global-selection/alert-types?language=en&isRuleEditor=true',
        method: HttpMethod.GET,
      },
      {
        url: 'api/global-selection/alert-types-open?language=en',
        method: HttpMethod.GET,
      },
      { url: 'api/global-selection/regions', method: HttpMethod.GET },
      { url: 'api/global-selection/demand-planners', method: HttpMethod.GET },
      {
        url: 'api/global-selection/sectors?language=en',
        method: HttpMethod.GET,
      },
      { url: 'api/global-selection/product-plants', method: HttpMethod.GET },
      { url: 'api/global-selection/sector-mgmt', method: HttpMethod.GET },
      { url: 'api/global-selection/sales-areas', method: HttpMethod.GET },
      {
        url: 'api/global-selection/sales-organisations?language=en',
        method: HttpMethod.GET,
      },
      { url: 'api/global-selection/key-accounts', method: HttpMethod.GET },
      { url: 'api/global-selection/product-line', method: HttpMethod.GET },
      {
        url: 'api/global-selection/stochastic-types?language=en',
        method: HttpMethod.GET,
      },
    ]);
  });
});
