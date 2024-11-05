import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import {
  createHttpFactory,
  mockProvider,
  SpectatorHttp,
} from '@ngneat/spectator/jest';

import { SelectableOptionsService } from './selectable-options.service';

describe('SelectableOptionsService', () => {
  let spectator: SpectatorHttp<SelectableOptionsService>;
  const createHttp = createHttpFactory(SelectableOptionsService);

  beforeEach(
    () =>
      (spectator = createHttp({
        providers: [mockProvider(HttpClient, { get: () => of({}) })],
      }))
  );

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('preload', () => {
    it('should call SelectableOptionsService.call to load all needed data', () => {
      const spy = jest.spyOn(spectator.service as any, 'call');
      spectator.service['preload']();

      expect(spy).toHaveBeenCalledTimes(12);

      [
        'alert-types?language=de&isRuleEditor=true',
        'alert-types-open?language=de',
        'regions',
        'demand-planners',
        'sectors?language=de',
        'product-plants',
        'sector-mgmt',
        'sales-areas',
        'sales-organisations?language=de',
        'key-accounts',
        'product-line',
        'stochastic-types?language=de',
      ].forEach((call) => expect(spy).toHaveBeenCalledWith(call));
    });
  });
});
