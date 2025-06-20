import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { MicrosoftUsersResponse } from '@gq/shared/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { APPROVAL_STATE_MOCK } from '../../../../../testing/mocks/state/approval-state.mock';
import { MicrosoftGraphMapperService } from './microsoft-graph-mapper.service';

describe('microsoftGraphMapperService', () => {
  let spectator: SpectatorService<MicrosoftGraphMapperService>;
  let service: MicrosoftGraphMapperService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: MicrosoftGraphMapperService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });
  describe('getActiveDirectoryUsers', () => {
    test('should call with correct path and header', () => {
      const searchExpression = 'test';
      service.getActiveDirectoryUsers(searchExpression).subscribe();
      const req = httpMock.expectOne(
        `${service['PATH_USERS']}?$search="displayName:${searchExpression}" OR "userPrincipalName:${searchExpression}"&$filter=givenName ne null and surname ne null&$orderby=userPrincipalName&$select=givenName,surname,displayName,userPrincipalName,mail&$count=true&$top=20`
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
        `${service['PATH_USERS']}?$search="displayName:${searchExpression}" OR "userPrincipalName:${searchExpression}"&$filter=givenName ne null and surname ne null&$orderby=userPrincipalName&$select=givenName,surname,displayName,userPrincipalName,mail&$count=true&$top=20`
      );

      req.flush(response);
    });
  });

  describe('getActiveDirectoryUserByMultipleUserIds', () => {
    test('should call with correct path and header', () => {
      const userIds = ['test1', 'test2'];
      service.getActiveDirectoryUserByMultipleUserIds(userIds).subscribe();
      const req = httpMock.expectOne(
        `${service['PATH_USERS']}?$search="userPrincipalName:${userIds[0]}" OR "userPrincipalName:${userIds[1]}"&$filter=givenName ne null and surname ne null&$select=givenName,surname,displayName,userPrincipalName,mail&$count=true&$top=20`
      );

      expect(req.request.method).toBe(HttpMethod.GET);
      expect(req.request.headers.get('ConsistencyLevel')).toBe('eventual');
    });
    test('should map', () => {
      const userIds = ['herpisef', 'schlesni'];
      const expected = [
        {
          firstName: 'Stefan',
          lastName: 'Herpich',
          userId: 'herpisef',
          mail: 'herpisef@schaeffler.com',
        },
        {
          firstName: 'Stefanie',
          lastName: 'Schleer',
          userId: 'schlesni',
          mail: 'schlesni@schaeffler.com',
        },
      ];
      const response = {
        value: [
          {
            givenName: 'Stefan',
            surname: 'Herpich',
            displayName: 'Herpich, Stefan  SF/HZA-ZC3A',
            userPrincipalName: 'herpisef@schaeffler.com',
            mail: 'herpisef@schaeffler.com',
          },
          {
            givenName: 'Stefanie',
            surname: 'Schleer',
            displayName: 'Schleer, Stefanie  SF/HZA-ZC2A',
            userPrincipalName: 'schlesni@schaeffler.com',
            mail: 'schlesni@schaeffler.com',
          },
        ],
      } as MicrosoftUsersResponse;

      service
        .getActiveDirectoryUserByMultipleUserIds(userIds)
        .subscribe((data) => expect(data).toEqual(expected));

      const req = httpMock.expectOne(
        `${service['PATH_USERS']}?$search="userPrincipalName:${userIds[0]}" OR "userPrincipalName:${userIds[1]}"&$filter=givenName ne null and surname ne null&$select=givenName,surname,displayName,userPrincipalName,mail&$count=true&$top=20`
      );

      req.flush(response);
    });
  });

  describe('getActiveDirectoryUserByUserId', () => {
    test('should call with correct path and header', () => {
      const userId = 'user';
      service.getActiveDirectoryUserByUserId(userId).subscribe();
      const req = httpMock.expectOne(
        `${service['PATH_USERS']}/user@schaeffler.com?$select=givenName,surname,displayName,userPrincipalName,mail`
      );

      expect(req.request.method).toBe(HttpMethod.GET);
      expect(req.request.headers.get('ConsistencyLevel')).toBe('eventual');
    });
  });
});
