import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { FilterDimension } from '../../shared/models';
import { UserSettings } from './models/user-settings.model';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  const dimension = FilterDimension.BOARD;
  const dimensionKey = '123';
  const dimensionDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
  let service: UserSettingsService;
  let httpMock: HttpTestingController;
  let spectator: SpectatorService<UserSettingsService>;

  const createService = createServiceFactory({
    service: UserSettingsService,
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserSettings', () => {
    test('should return user settings', () => {
      const mock: UserSettings = {
        dimension,
        dimensionKey,
        dimensionDisplayName,
      };
      service.getUserSettings().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('api/v1/user-settings');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('saveUserSettings', () => {
    test('should save user settings', () => {
      const userSettings: UserSettings = {
        dimension,
        dimensionKey,
        dimensionDisplayName,
      };
      service.updateUserSettings(userSettings).subscribe((response) => {
        expect(response).toEqual(undefined);
      });

      const req = httpMock.expectOne('api/v1/user-settings');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        dimension,
        dimensionKey,
        dimensionDisplayName,
      });
    });
  });
});
