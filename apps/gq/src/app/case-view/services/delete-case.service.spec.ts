import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService } from '@schaeffler/http';

import { DeleteCaseService } from './delete-case.service';

describe('Delete Case Service', () => {
  let service: DeleteCaseService;
  let spectator: SpectatorService<DeleteCaseService>;
  let dataService: DataService;

  const createService = createServiceFactory({
    service: DeleteCaseService,
    imports: [HttpClientTestingModule],
    providers: [
      DeleteCaseService,
      {
        provide: DataService,
        useValue: {
          delete: jest.fn().mockReturnValue(of()),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    dataService = spectator.inject(DataService);
  });

  describe('getCases', () => {
    test('should call DataService delete', () => {
      const gqId = ['123'];
      service.deleteCase(gqId);
      expect(dataService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
