import { MatDialog } from '@angular/material/dialog';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { DisclaimerService } from './disclaimer.service';

describe('DisclaimerServie', () => {
  let spectator: SpectatorService<DisclaimerService>;
  let service: DisclaimerService;

  const createService = createServiceFactory({
    service: DisclaimerService,
    imports: [],
    providers: [mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(DisclaimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call through to the dialog', () => {
    service.openCO2Disclaimer(true);
    expect(service['matDialog'].open).toHaveBeenCalled();
  });
});
