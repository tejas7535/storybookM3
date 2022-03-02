import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CostShareService } from './cost-share.service';

describe('CostShareService', () => {
  let spectator: SpectatorService<CostShareService>;
  const createService = createServiceFactory(CostShareService);

  beforeEach(() => (spectator = createService()));

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should return correct price category', () => {
    const testValues = [
      [undefined, 'default'],
      [-0.09, 'negative'],
      [0, 'lowest'],
      [0.1, 'lowest'],
      [0.11, 'low'],
      [0.2, 'low'],
      [0.21, 'medium'],
      [0.3, 'medium'],
      [0.31, 'high'],
      [0.5, 'high'],
      [0.51, 'highest'],
      [1, 'highest'],
    ];

    testValues.forEach((testValue) => {
      expect(spectator.service.getCostShareCategory(+testValue[0])).toEqual(
        testValue[1]
      );
    });
  });
});
