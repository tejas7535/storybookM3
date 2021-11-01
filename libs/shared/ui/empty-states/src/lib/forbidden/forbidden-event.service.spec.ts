import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Observable } from 'rxjs';

import { ForbiddenEventService } from './forbidden-event.service';

describe('ForbiddenEventService', () => {
  let service: ForbiddenEventService;
  let spectator: SpectatorService<ForbiddenEventService>;

  const createService = createServiceFactory({
    service: ForbiddenEventService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide button click observable', () => {
    expect(service.forbiddenPageActionButtonClicked$).toBeInstanceOf(
      Observable
    );
  });
});
