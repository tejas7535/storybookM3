import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService } from '@schaeffler/http';

import { ViewCasesService } from './view-cases.service';

describe('View Case Service', () => {
  let service: ViewCasesService;
  let spectator: SpectatorService<ViewCasesService>;
  let dataService: DataService;

  const createService = createServiceFactory({
    service: ViewCasesService,
    imports: [HttpClientTestingModule],
    providers: [
      ViewCasesService,
      {
        provide: DataService,
        useValue: {
          getAll: jest.fn().mockReturnValue(of()),
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
    test('should call DataService getAll', () => {
      service.getCases();
      expect(dataService.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
