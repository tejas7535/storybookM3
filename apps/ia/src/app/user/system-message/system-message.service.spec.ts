import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ISystemMessage } from '../../shared/models/system-message';
import { SystemMessageService } from './system-message.service';

describe('SystemMessageService', () => {
  let httpMock: HttpTestingController;
  let service: SystemMessageService;
  let spectator: SpectatorService<SystemMessageService>;

  const createService = createServiceFactory({
    service: SystemMessageService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getSystemMessage', () => {
    test('should call rest service', () => {
      const response = {} as ISystemMessage[];
      service.getSystemMessage().subscribe((result) => {
        expect(result).toEqual(response);
      });
      const req = httpMock.expectOne('api/v1/system-message');
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });

  describe('dismissSystemMessage', () => {
    test('should call rest service', () => {
      const id = 123;
      const response = {} as ISystemMessage;
      service.dismissSystemMessage(id).subscribe((result) => {
        expect(result).toEqual(response);
      });
      const req = httpMock.expectOne('api/v1/system-message');
      expect(req.request.method).toBe('PATCH');
      req.flush(response);
    });
  });
});
