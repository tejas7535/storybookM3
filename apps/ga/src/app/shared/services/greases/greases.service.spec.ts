import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '@ga/environments/environment';

import { Grease, GreasesProviderService } from './greases.service';

describe('GreasesProviderService', () => {
  let spectator: SpectatorService<GreasesProviderService>;
  let service: GreasesProviderService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: GreasesProviderService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(GreasesProviderService);
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchAllGreases', () => {
    it('should fetch greases from the correct URL', () => {
      const mockGreases: Grease[] = [
        {
          company: 'Test Company',
          id: '1',
          name: 'Test Grease',
          mixableGreases: ['2', '3'],
        },
      ];

      service.fetchAllGreases().subscribe((greases) => {
        expect(greases).toEqual(mockGreases);
      });

      const req = httpMock.expectOne(
        `${environment.dmcBackendUrl}/greases/getGreases`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockGreases);
    });
  });

  describe('fetchAllSchaefflerGreases', () => {
    it('should fetch Schaeffler greases from the correct URL', () => {
      const mockSchaefflerGreases: Grease[] = [
        {
          company: 'Schaeffler',
          id: '4',
          name: 'Arcanol Grease',
          mixableGreases: ['5', '6'],
        },
      ];

      service.fetchAllSchaefflerGreases().subscribe((greases) => {
        expect(greases).toEqual(mockSchaefflerGreases);
      });

      const req = httpMock.expectOne(
        `${environment.dmcBackendUrl}/greases/getArcanolGreases`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSchaefflerGreases);
    });
  });
});
