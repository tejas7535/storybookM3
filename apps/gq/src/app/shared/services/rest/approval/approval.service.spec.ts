import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  ApiVersion,
  ApprovalEventType,
  ApprovalWorkflowBaseInformation,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  MicrosoftUsersResponse,
  QuotationStatus,
  TriggerApprovalWorkflowRequest,
  UpdateFunction,
} from '@gq/shared/models';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  HttpMethod,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

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
    providers: [mockProvider(TranslocoLocaleService)],
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

  describe('triggerApprovalWorkflow', () => {
    test('should call with correct path and process the response', () => {
      const sapId = 'testSapId';

      const baseInformation: ApprovalWorkflowBaseInformation = {
        gqId: 998_755,
        firstApprover: 'APPR1',
        secondApprover: 'APPR2',
        thirdApprover: 'APPR3',
        infoUser: 'CC00',
        comment: 'test comment',
        projectInformation: 'project info',
      };

      const request: TriggerApprovalWorkflowRequest = {
        ...baseInformation,
        gqLinkBase64Encoded: 'aHR0cHM6Ly90ZXN0LmRlP3ExPXRlc3QxJnEyPXRlc3Qy',
      };

      const response = {
        approvalGeneral: {
          ...APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral,
          approvalLevel: 'L2',
          ...baseInformation,
        },
        approvalEvents: [
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[2],
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[1],
        ],
      };

      service.triggerApprovalWorkflow(sapId, request).subscribe((data) =>
        expect(data).toEqual({
          ...APPROVAL_STATE_MOCK.approvalCockpit,
          approvalGeneral: {
            ...APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral,
            ...baseInformation,
          },
        })
      );
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_START_APPROVAL_WORKFLOW}/${sapId}`
      );

      expect(req.request.method).toBe(HttpMethod.POST);
      expect(req.request.body).toEqual(request);

      req.flush(response);
    });
  });

  describe('saveApprovalWorkflowInformation', () => {
    test('should call with correct path and deliver correct result', () => {
      const sapId = 'testSapId';
      const request: ApprovalWorkflowBaseInformation = {
        gqId: 998_755,
        firstApprover: 'APPR1',
        secondApprover: 'APPR2',
        thirdApprover: 'APPR3',
        infoUser: 'CC00',
        comment: 'test comment',
        projectInformation: 'project info',
      };
      const response: ApprovalWorkflowInformation = {
        ...request,
        sapId,
        currency: undefined,
        autoApproval: undefined,
        thirdApproverRequired: undefined,
        totalNetValue: undefined,
        gpm: undefined,
        priceDeviation: undefined,
        approvalLevel: undefined,
      };

      service
        .saveApprovalWorkflowInformation(sapId, request)
        .subscribe((data) => expect(data).toEqual(response));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_GENERAL_INFO}/${sapId}`
      );

      expect(req.request.method).toBe(HttpMethod.POST);
      expect(req.request.body).toEqual(request);

      req.flush(response);
    });
  });

  describe('updateApprovalWorkflow', () => {
    test('should call with correct path and deliver correct result', () => {
      const sapId = 'testSapId';
      const request = {
        gqId: 998_755,
        comment: 'test comment',
        updateFunction: UpdateFunction.APPROVE_QUOTATION,
      };
      const response = {
        gqId: request.gqId,
        sapId,
        comment: request.comment,
        quotationStatus: QuotationStatus.APPROVED,
        userId: 'testUser',
        event: ApprovalEventType.APPROVED,
        verified: true,
        eventDate: new Date().toISOString(),
      } as ApprovalWorkflowEvent;

      service
        .updateApprovalWorkflow(sapId, request)
        .subscribe((data) => expect(data).toEqual(response));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_UPDATE_APPROVAL_WORKFLOW}/${sapId}`
      );

      expect(req.request.method).toBe(HttpMethod.POST);
      expect(req.request.body).toEqual(request);

      req.flush(response);
    });
  });

  describe('getApprovalCockpitData', () => {
    test('should call with correct path', () => {
      service.getApprovalCockpitData('12345').subscribe();
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_COCKPIT_INFO}/12345`
      );

      expect(req.request.method).toBe(HttpMethod.GET);
    });

    test('should map and sort', () => {
      const response = {
        approvalGeneral: {
          ...APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral,
          approvalLevel: 'L2',
        },
        approvalEvents: [
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[2],
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[1],
        ],
      };
      service
        .getApprovalCockpitData('12345')
        .subscribe((data) =>
          expect(data).toEqual(APPROVAL_STATE_MOCK.approvalCockpit)
        );
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_COCKPIT_INFO}/12345`
      );

      req.flush(response);
    });

    test('should map and sort, desc by date and id', () => {
      const event1 = {
        id: 12,
        eventDate: '2023-01-01 12:00',
      } as ApprovalWorkflowEvent;
      const event2 = {
        id: 13,
        eventDate: '2023-01-01 12:00',
      } as ApprovalWorkflowEvent;
      const response = {
        approvalGeneral: {
          ...APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral,
          approvalLevel: 'L2',
        },
        approvalEvents: [event1, event2],
      };
      service.getApprovalCockpitData('12345').subscribe((data) =>
        expect(data).toEqual({
          ...APPROVAL_STATE_MOCK.approvalCockpit,
          approvalEvents: [event2, event1],
        })
      );
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_COCKPIT_INFO}/12345`
      );

      req.flush(response);
    });
  });
});
