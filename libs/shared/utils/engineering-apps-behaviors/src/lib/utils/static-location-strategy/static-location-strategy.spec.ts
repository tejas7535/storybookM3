import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { StaticLocationStrategy } from './static-location-strategy';
import { StaticPlatformLocation } from './static-platform-location';

describe('StaticLocationStrategy', () => {
  let staticLocationStrategy: StaticLocationStrategy;
  let spectator: SpectatorService<StaticLocationStrategy>;

  const createService = createServiceFactory({
    service: StaticLocationStrategy,
    providers: [mockProvider(StaticPlatformLocation)],
  });

  beforeEach(() => {
    spectator = createService();
    staticLocationStrategy = spectator.service;
  });

  it('should create', () => {
    expect(staticLocationStrategy).toBeTruthy();
  });
});
