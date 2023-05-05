import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator';

import { ApprovalService } from './approval.service';
import { ApprovalPaths } from './approval-paths.enum';

describe('ApprovalService', () => {
  let service: ApprovalService;
  let spectator: SpectatorService<ApprovalService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ApprovalService,
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

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllApprovers', () => {
    test('should call with correct path', () => {
      service.getAllApprovers().subscribe();
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVERS}`
      );

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });
});
