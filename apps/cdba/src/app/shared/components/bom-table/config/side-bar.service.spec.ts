import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SidebarService } from './side-bar.service';

describe('SidebarService', () => {
  let service: SidebarService;
  let spectator: SpectatorService<SidebarService>;

  const createService = createServiceFactory({
    service: SidebarService,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
