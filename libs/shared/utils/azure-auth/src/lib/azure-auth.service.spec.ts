import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { MSAL_GUARD_CONFIG, MsalService } from '@azure/msal-angular';
import {
  AccountInfo as AzureAccountInfo,
  InteractionType,
} from '@azure/msal-browser';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AzureAuthService } from './azure-auth.service';
import { AccountInfo } from './models';

const guardConfig: any = {
  interactionType: undefined,
  authRequest: undefined,
};

const factory = () => guardConfig;

describe('Azure Auth Service', () => {
  let service: AzureAuthService;
  let spectator: SpectatorService<AzureAuthService>;
  let msalService: MsalService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: AzureAuthService,
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: MsalService,
        useValue: {
          loginRedirect: jest.fn(),
          loginPopup: jest.fn(),
          logout: jest.fn(),
          instance: {
            setActiveAccount: jest.fn(),
          },
        },
      },
      {
        provide: MSAL_GUARD_CONFIG,
        useFactory: factory,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    msalService = spectator.inject(MsalService);
    httpMock = spectator.inject(HttpTestingController);
  });

  describe('createImageFromBlob', () => {
    test('should return promise with image url', (done) => {
      const fileReader = new FileReader();
      const spy = jest
        .spyOn(global, 'FileReader')
        .mockImplementation(() => fileReader);

      const blob: Blob = new Blob(['test'], { type: 'image/png' });

      AzureAuthService.createImageFromBlob(blob).subscribe((res) => {
        expect(res).toEqual('data:image/png;base64,dGVzdA==');
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('extractDepartmentFromAzureAccountInfo', () => {
    let accountInfo: AzureAccountInfo;
    let result: string;
    let expected: string;

    beforeEach(() => {
      accountInfo = undefined;
      result = undefined;
      expected = undefined;
    });

    test('should return undefined for undefined name', () => {
      // provide accountInfo w/o name property as it is optional
      accountInfo = {
        homeAccountId: 'foo bar',
      } as unknown as AzureAccountInfo;

      result =
        AzureAuthService.extractDepartmentFromAzureAccountInfo(accountInfo);

      expect(result).toBeUndefined();
    });

    test('should return undefined for guest accounts', () => {
      // Guest Accounts have the format "given_name family_name"
      // instead of "family_name, given_name department"
      accountInfo = { name: 'Hans Wurst' } as unknown as AzureAccountInfo;

      result =
        AzureAuthService.extractDepartmentFromAzureAccountInfo(accountInfo);

      expect(result).toBeUndefined();
    });

    test('should return correct department for external employee accounts', () => {
      accountInfo = {
        name: 'Probst, Lars Helmuth (ext.) SF/HZA-DSS',
      } as unknown as AzureAccountInfo;
      expected = 'SF/HZA-DSS';

      result =
        AzureAuthService.extractDepartmentFromAzureAccountInfo(accountInfo);

      expect(result).toEqual(expected);
    });

    test('should return correct department for internal employee accounts', () => {
      accountInfo = {
        name: 'Machado de Menezes, Alisson  SF/HZA-ZC2P',
      } as unknown as AzureAccountInfo;
      expected = 'SF/HZA-ZC2P';

      result =
        AzureAuthService.extractDepartmentFromAzureAccountInfo(accountInfo);

      expect(result).toEqual(expected);
    });
  });

  describe('login', () => {
    test('should use popup and authrequest', () => {
      guardConfig.interactionType = InteractionType.Popup;
      guardConfig.authRequest = {};
      const expected: any = {
        account: {
          name: 'test',
        },
      };

      msalService.loginPopup = jest.fn(() => of(expected));

      service.login();

      expect(msalService.loginPopup).toHaveBeenCalledWith({
        ...guardConfig.authRequest,
      });
      expect(msalService.instance.setActiveAccount).toHaveBeenCalledWith(
        expected.account
      );
    });
    test('should use popup without authrequest', () => {
      guardConfig.interactionType = InteractionType.Popup;
      guardConfig.authRequest = undefined;
      const expected: any = {
        account: {
          name: 'test',
        },
      };

      msalService.loginPopup = jest.fn(() => of(expected));

      service.login();

      expect(msalService.loginPopup).toHaveBeenCalledWith();
      expect(msalService.instance.setActiveAccount).toHaveBeenCalledWith(
        expected.account
      );
    });

    test('should use redirect without authrequest', () => {
      guardConfig.interactionType = InteractionType.Redirect;
      guardConfig.authRequest = undefined;

      msalService.loginRedirect = jest.fn();

      service.login();

      expect(msalService.loginRedirect).toHaveBeenCalledWith();
    });

    test('should use redirect with authrequest', () => {
      guardConfig.interactionType = InteractionType.Redirect;
      guardConfig.authRequest = {};

      msalService.loginRedirect = jest.fn();

      service.login();

      expect(msalService.loginRedirect).toHaveBeenCalledWith({
        ...guardConfig.authRequest,
      });
    });
  });

  describe('logout', () => {
    test('should call logout', () => {
      service.logout();

      expect(msalService.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProfileImage', () => {
    test('should return profile image url', () => {
      const blob: Blob = new Blob(['test'], { type: 'image/png' });
      const url = 'url/to/img';

      AzureAuthService.createImageFromBlob = jest.fn(() => of(url));

      service.getProfileImage().subscribe((response) => {
        expect(response).toEqual(url);
        expect(AzureAuthService.createImageFromBlob).toHaveBeenCalledTimes(1);
      });

      const req = httpMock.expectOne(
        'https://graph.microsoft.com/v1.0/me/photos/48x48/$value'
      );
      expect(req.request.method).toBe('GET');
      req.flush(blob);
    });
  });

  describe('setActiveAccount', () => {
    test('should set active acc', () => {
      const account: AzureAccountInfo = {} as unknown as AzureAccountInfo;

      service.setActiveAccount(account);

      expect(msalService.instance.setActiveAccount).toHaveBeenCalledWith(
        account
      );
    });
  });

  describe('handleAccount', () => {
    let accInfos: AzureAccountInfo[];

    beforeEach(() => {
      const accInfo = { username: 'Hans' } as unknown as AzureAccountInfo;
      const accInfo2 = { username: 'Dieter' } as unknown as AzureAccountInfo;
      const accInfo3 = { username: 'Werner' } as unknown as AzureAccountInfo;
      accInfos = [accInfo, accInfo2, accInfo3];
      msalService.instance.getAllAccounts = jest.fn(() => accInfos);

      msalService.instance.setActiveAccount = jest.fn();
    });
    test('should return active acc if possible', () => {
      const activeAcc = {
        username: 'Chung',
        name: 'Cho, Chung SF/HZA',
      } as unknown as AzureAccountInfo;
      msalService.instance.getActiveAccount = jest.fn(() => activeAcc);

      const expected = { ...activeAcc, department: 'SF/HZA' };

      const result = service.handleAccount();

      expect(result).toEqual(expected);

      expect(msalService.instance.getActiveAccount).toHaveBeenCalledTimes(1);
      expect(msalService.instance.getAllAccounts).not.toHaveBeenCalled();
    });

    test('should return first acc from available accs', () => {
      msalService.instance.getActiveAccount = jest.fn(
        () => undefined as AccountInfo
      );

      const result = service.handleAccount();

      expect(result).toEqual(accInfos[0]);

      expect(msalService.instance.getActiveAccount).toHaveBeenCalledTimes(1);
      expect(msalService.instance.getAllAccounts).toHaveBeenCalledTimes(2);
      expect(msalService.instance.setActiveAccount).toHaveBeenCalledWith(
        accInfos[0]
      );
    });
  });
});
