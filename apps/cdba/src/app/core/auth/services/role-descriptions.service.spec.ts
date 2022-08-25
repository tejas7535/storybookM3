import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { withCache } from '@ngneat/cashew';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { RoleDescriptions } from '@cdba/core/auth/models/roles.models';
import { ROLE_DESCRIPTIONS_MOCK } from '@cdba/testing/mocks';

import { RoleDescriptionsService } from './role-descriptions.service';

describe('RoleDescriptionsService', () => {
  let spectator: SpectatorService<RoleDescriptionsService>;
  let service: RoleDescriptionsService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: RoleDescriptionsService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(RoleDescriptionsService);
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getRoleDescriptions', () => {
    test('should get role descriptions', () => {
      const mock = ROLE_DESCRIPTIONS_MOCK;

      service.getRoleDescriptions().subscribe((response: RoleDescriptions) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('api/v1/role-description');
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(mock);
    });
  });
});
