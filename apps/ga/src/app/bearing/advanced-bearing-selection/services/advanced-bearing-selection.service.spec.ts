import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AdvancedBearingSelectionService } from './advanced-bearing-selection.service';

describe('AdvancedBearingSelectionService', () => {
  let service: AdvancedBearingSelectionService;
  let spectator: SpectatorService<AdvancedBearingSelectionService>;

  const createService = createServiceFactory({
    service: AdvancedBearingSelectionService,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should provide setting options', () => {
    expect(service.bearingTypes).toBeDefined();
    expect(service.dimensionMinValue).toBeDefined();
    expect(service.dimensionMaxValue).toBeDefined();
    expect(service.boreDiameterRangeFilter).toBeDefined();
    expect(service.outsideDiameterRangeFilter).toBeDefined();
    expect(service.widthRangeFilter).toBeDefined();
  });
});
