import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { MSAL_GUARD_CONFIG, MsalService } from '@azure/msal-angular';
import { AccountInfo, InteractionType } from '@azure/msal-browser';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { AzureAuthService } from './azure-auth.service';

const guardConfig: any = {
  interactionType: undefined,
  authRequest: undefined,
};

const factory = () => {
  return guardConfig;
};

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

  describe('test createImageFromBlob', () => {
    test('should return promise with image url', (done) => {
      const url = 'test';

      const dummyReader = ({
        readAsDataURL: jest.fn(),
        result: url,
      } as unknown) as FileReader;

      const spy = jest
        .spyOn(global, 'FileReader')
        .mockImplementation(() => dummyReader);

      const blob: Blob = new Blob(['test'], { type: 'image/png' });

      AzureAuthService.createImageFromBlob(blob).subscribe((res) => {
        expect(res).toEqual(url);
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });

      dummyReader.onload({} as any);
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
      const account: AccountInfo = ({} as unknown) as AccountInfo;

      service.setActiveAccount(account);

      expect(msalService.instance.setActiveAccount).toHaveBeenCalledWith(
        account
      );
    });
  });

  describe('handleAccount', () => {
    let accInfos: AccountInfo[];

    beforeEach(() => {
      const accInfo = ({ username: 'Hans' } as unknown) as AccountInfo;
      const accInfo2 = ({ username: 'Dieter' } as unknown) as AccountInfo;
      const accInfo3 = ({ username: 'Werner' } as unknown) as AccountInfo;
      accInfos = [accInfo, accInfo2, accInfo3];
      msalService.instance.getAllAccounts = jest.fn(() => accInfos);

      msalService.instance.setActiveAccount = jest.fn();
    });
    test('should return active acc if possible', () => {
      const activeAcc = ({ username: 'Chung' } as unknown) as AccountInfo;
      msalService.instance.getActiveAccount = jest.fn(() => activeAcc);

      const result = service.handleAccount();

      expect(result).toEqual(activeAcc);

      expect(msalService.instance.getActiveAccount).toHaveBeenCalledTimes(1);
      expect(msalService.instance.getAllAccounts).not.toHaveBeenCalled();
    });

    test('should return first acc from available accs', () => {
      msalService.instance.getActiveAccount = jest.fn(() => undefined);

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
