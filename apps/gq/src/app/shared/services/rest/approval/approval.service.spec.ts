import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ApiVersion, MicrosoftUsersResponse } from '@gq/shared/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator';

import { APPROVAL_STATE_MOCK } from '../../../../../testing/mocks/';
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

    test('should map and sort', () => {
      const response = [
        {
          userId: 'schlesni',
          firstName: 'Stefanie',
          lastName: 'Schleer',
          approvalLevel: 'L2',
        },
        {
          userId: 'herpiseg',
          firstName: 'Stefan',
          lastName: 'Albert',
          approvalLevel: 'L1',
        },
        {
          userId: 'herpisef',
          firstName: 'Stefan',
          lastName: 'Herpich',
          approvalLevel: 'L1',
        },
        {
          userId: 'herpiseg',
          firstName: 'Franz',
          lastName: 'Albert',
          approvalLevel: 'L1',
        },
        {
          userId: 'anyId',
          firstName: 'Jan',
          lastName: 'Schmitt',
          approvalLevel: 'L5',
        },

        {
          userId: 'fischjny',
          firstName: 'Jenny',
          lastName: 'Fischer',
          approvalLevel: 'L3',
        },
        {
          userId: 'soehnpsc',
          firstName: 'Pascal',
          lastName: 'Soehnlein',
          approvalLevel: 'L4',
        },
      ] as any;

      service
        .getAllApprovers()
        .subscribe((data) =>
          expect(data).toEqual(APPROVAL_STATE_MOCK.approvers)
        );

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVERS}`
      );

      req.flush(response);
    });
  });

  describe('getApprovalStatus', () => {
    test('should call with correct path', () => {
      service.getApprovalStatus('12345').subscribe();
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_STATUS}/12345`
      );

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  test('should map', () => {
    const response = {
      ...APPROVAL_STATE_MOCK.approvalStatus,
      approvalLevel: 'L2',
    };
    service
      .getApprovalStatus('12345')
      .subscribe((data) =>
        expect(data).toEqual(APPROVAL_STATE_MOCK.approvalStatus)
      );
    const req = httpMock.expectOne(
      `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_STATUS}/12345`
    );

    req.flush(response);
  });

  describe('getActiveDirectoryUsers', () => {
    test('should call with correct path and header', () => {
      const searchExpression = 'test';
      service.getActiveDirectoryUsers(searchExpression).subscribe();
      const req = httpMock.expectOne(
        `${ApprovalPaths.PATH_USERS}?$search="displayName:${searchExpression}" OR "userPrincipalName:${searchExpression}"&$filter=givenName ne null and surname ne null&$orderby=userPrincipalName&$select=givenName,surname,displayName,userPrincipalName&$count=true&$top=20`
      );

      expect(req.request.method).toBe(HttpMethod.GET);
      expect(req.request.headers.get('ConsistencyLevel')).toBe('eventual');
    });

    test('should map', () => {
      const searchExpression = 'test';
      const response = {
        value: [
          {
            givenName: 'Stefan',
            surname: 'Herpich',
            displayName: 'Herpich, Stefan  SF/HZA-ZC3A',
            userPrincipalName: 'herpisef@schaeffler.com',
          },
          {
            givenName: 'Stefan',
            surname: 'Albert',
            displayName: 'Stefan, Albert  SF/TST-ZC2A',
            userPrincipalName: 'herpiseg@schaeffler.com',
          },
          {
            givenName: 'Stefanie',
            surname: 'Schleer',
            displayName: 'Schleer, Stefanie  SF/HZA-ZC2A',
            userPrincipalName: 'schlesni@schaeffler.com',
          },

          {
            givenName: 'Pascal',
            surname: 'Soehnlein',
            displayName: 'Soehnlein, Pascal  SF/HZA-ZC2A',
            userPrincipalName: 'soehnpsc@schaeffler.com',
          },
        ],
      } as MicrosoftUsersResponse;

      service
        .getActiveDirectoryUsers(searchExpression)
        .subscribe((data) =>
          expect(data).toEqual(APPROVAL_STATE_MOCK.activeDirectoryUsers)
        );

      const req = httpMock.expectOne(
        `${ApprovalPaths.PATH_USERS}?$search="displayName:${searchExpression}" OR "userPrincipalName:${searchExpression}"&$filter=givenName ne null and surname ne null&$orderby=userPrincipalName&$select=givenName,surname,displayName,userPrincipalName&$count=true&$top=20`
      );

      req.flush(response);
    });
  });
});
