import { BehaviorSubject, of, throwError } from 'rxjs';

import { CustomRoute } from '../../app.routes';
import { AppRoutePath } from '../../app.routes.enum';
import { SelectedKpisAndMetadata } from '../../feature/demand-validation/model';
import { Region } from '../../feature/global-selection/model';
import {
  DemandValidationTimeRangeUserSettingsKey,
  DemandValidationUserSettingsKey,
  UserSettings,
  UserSettingsKey,
} from '../models/user-settings.model';
import { Stub } from '../test/stub.class';
import { DateRangePeriod } from '../utils/date-range';
import { UserService } from './user.service';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
  },
});

describe('UserService', () => {
  let service: UserService;
  const roleSubject = new BehaviorSubject<string[]>([]);

  beforeEach(() => {
    service = Stub.get<UserService>({
      component: UserService,
      providers: [Stub.getAuthServiceProvider(roleSubject)],
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should call loadRegion and loadUserSettings', () => {
      const loadRegionSpy = jest
        .spyOn(service, 'loadRegion')
        .mockReturnValue(of(Region.Europe));
      const loadUserSettingsSpy = jest.spyOn(
        service as any,
        'loadUserSettings'
      );

      service.init();

      expect(loadRegionSpy).toHaveBeenCalled();
      expect(loadUserSettingsSpy).toHaveBeenCalled();
    });
  });

  describe('loadRegion', () => {
    it('should set region from localStorage if available', () => {
      mockGetItem.mockReturnValue(Region.Europe);

      service.loadRegion().subscribe((region) => {
        expect(region).toBe(Region.Europe);
        expect(service.region()).toBe(Region.Europe);
      });
    });

    it('should fetch region from backend if not in localStorage', () => {
      mockGetItem.mockReturnValue(null);
      jest.spyOn(service['http'], 'get').mockReturnValue(of(Region.Europe));

      service.loadRegion().subscribe((region) => {
        expect(region).toBe(Region.Europe);
        expect(service.region()).toBe(Region.Europe);
        expect(mockSetItem).toHaveBeenCalledWith('region', Region.Europe);
      });
    });

    it('should handle errors gracefully', () => {
      mockGetItem.mockReturnValue(null);
      jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(throwError(() => new Error('any error')));
      const snackbarSpy = jest.spyOn(service['snackbarService'], 'error');

      service.loadRegion().subscribe((region) => {
        expect(region).toBeNull();
        expect(snackbarSpy).toHaveBeenCalledWith(
          'error.loadingConfigurationFailed'
        );
      });
    });
  });

  describe('filterVisibleRoutes', () => {
    it('should return all routes if no visibility, region, or role restrictions are applied', () => {
      const routes: CustomRoute[] = [
        { visible: true, data: {} },
        { visible: true, data: {} },
      ] as any;

      const result = service.filterVisibleRoutes(routes);

      expect(result).toEqual(routes);
    });

    it('should filter out routes with visible set to false', () => {
      const routes: CustomRoute[] = [
        { visible: true, data: {} },
        { visible: false, data: {} },
      ] as any;

      const result = service.filterVisibleRoutes(routes);

      expect(result).toEqual([{ visible: true, data: {} }]);
    });

    it('should filter out routes not allowed for the current region', () => {
      service.region.set(Region.Europe);
      const routes: CustomRoute[] = [
        { visible: true, data: { allowedRegions: [Region.Europe] } },
        { visible: true, data: { allowedRegions: [Region.AsiaPacific] } },
      ] as any;

      const result = service.filterVisibleRoutes(routes);

      expect(result).toEqual([
        { visible: true, data: { allowedRegions: [Region.Europe] } },
      ]);
    });

    it('should filter out routes not allowed for the current roles', () => {
      roleSubject.next(['SD-D360_ADMIN=SW', 'SD-D360_BASIC_ACCESS=SW']);

      const routes: CustomRoute[] = [
        { visible: true, data: { allowedRoles: ['superUser'] } },
        { visible: true, data: { allowedRoles: ['user'] } },
      ] as any;

      const result = service.filterVisibleRoutes(routes);

      expect(result).toEqual([
        { visible: true, data: { allowedRoles: ['superUser'] } },
      ]);
    });

    it('should return routes that match all visibility, region, and role criteria', () => {
      roleSubject.next(['SD-D360_ADMIN=SW', 'SD-D360_BASIC_ACCESS=SW']);
      service.region.set(Region.Europe);
      const routes: CustomRoute[] = [
        {
          visible: true,
          data: {
            allowedRegions: [Region.Europe],
            allowedRoles: ['superUser'],
          },
        },
        {
          visible: true,
          data: {
            allowedRegions: [Region.AsiaPacific],
            allowedRoles: ['user'],
          },
        },
      ] as any;

      const result = service.filterVisibleRoutes(routes);

      expect(result).toEqual([
        {
          visible: true,
          data: {
            allowedRegions: [Region.Europe],
            allowedRoles: ['superUser'],
          },
        },
      ]);
    });

    it('should return an empty array if no routes match the criteria', () => {
      service.region.set(Region.Europe);
      roleSubject.next(['superUser']);
      const routes: CustomRoute[] = [
        {
          visible: false,
          data: {
            allowedRegions: [Region.Europe],
            allowedRoles: ['superUser'],
          },
        },
        {
          visible: true,
          data: {
            allowedRegions: [Region.AsiaPacific],
            allowedRoles: ['user'],
          },
        },
      ] as any;

      const result = service.filterVisibleRoutes(routes);

      expect(result).toEqual([]);
    });

    it('should handle undefined routes gracefully', () => {
      const result = service.filterVisibleRoutes(undefined as any);
      expect(result).toEqual(undefined);
    });

    it('should handle empty routes array', () => {
      const result = service.filterVisibleRoutes([]);
      expect(result).toEqual([]);
    });

    it('should handle routes with undefined data property', () => {
      const routes: CustomRoute[] = [
        { visible: true, data: undefined },
        { visible: true, data: {} },
      ] as any;

      const result = service.filterVisibleRoutes(routes);
      expect(result).toHaveLength(2);
    });

    it('should handle routes with undefined visible property', () => {
      const routes: CustomRoute[] = [
        { data: {} }, // visible is undefined
        { visible: true, data: {} },
      ] as any;

      const result = service.filterVisibleRoutes(routes);
      expect(result).toHaveLength(2);
    });

    it('should filter routes when region is null but allowedRegions is defined', () => {
      service.region.set(null);
      const routes: CustomRoute[] = [
        { visible: true, data: { allowedRegions: [Region.Europe] } },
      ] as any;

      const result = service.filterVisibleRoutes(routes);
      expect(result).toEqual([]);
    });
  });

  describe('updateUserSettings', () => {
    it('should update user settings and save them', () => {
      const saveUserSettingsSpy = jest.spyOn(
        service as any,
        'saveUserSettings'
      );
      const newSettings: UserSettings = {
        systemMessage: null,
        startPage: 'newStartPage' as any,
        demandValidation: null,
        overviewPage: null,
      };

      service.updateUserSettings(
        UserSettingsKey.StartPage,
        newSettings.startPage
      );

      expect(service.userSettings().startPage).toBe(newSettings.startPage);
      expect(saveUserSettingsSpy).toHaveBeenCalled();
    });
  });

  describe('saveUserSettings', () => {
    it('should call http.put with the correct URL and user settings', () => {
      const httpPutSpy = jest
        .spyOn(service['http'], 'put')
        .mockReturnValue(of(null));
      const userSettings = {
        startPage: 'someStartPage' as any,
        demandValidation: null,
      } as any;
      service.userSettings.set(userSettings);

      (service as any).saveUserSettings();

      expect(httpPutSpy).toHaveBeenCalledWith(
        service['USER_SETTINGS_API'],
        userSettings
      );
    });

    it('should exclude systemMessage when saving user settings', () => {
      const httpPutSpy = jest
        .spyOn(service['http'], 'put')
        .mockReturnValue(of(null));

      const userSettings = {
        systemMessage: 'This is a system message',
        startPage: 'someStartPage' as any,
        demandValidation: null,
      } as any;

      service.userSettings.set(userSettings);

      (service as any).saveUserSettings();

      // Verify systemMessage is not included in the PUT request
      const savedSettings = httpPutSpy.mock.calls[0][1];
      expect(savedSettings).not.toHaveProperty('systemMessage');
      expect(httpPutSpy).toHaveBeenCalledWith(
        service['USER_SETTINGS_API'],
        expect.not.objectContaining({
          systemMessage: 'This is a system message',
        })
      );
    });
  });

  describe('loadUserSettings', () => {
    it('should call http.get with the correct URL', () => {
      const httpGetSpy = jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(of({ startPage: 'someStartPage' } as any));

      (service as any).loadUserSettings();

      expect(httpGetSpy).toHaveBeenCalledWith(service['USER_SETTINGS_API']);
    });

    it('should update userSettings with the result from http.get', () => {
      const userSettings: UserSettings = {
        systemMessage: null,
        startPage: 'someStartPage' as any,
        demandValidation: null,
        overviewPage: null,
      };
      jest.spyOn(service['http'], 'get').mockReturnValue(of(userSettings));

      (service as any).loadUserSettings();

      expect(service.userSettings()).toEqual(userSettings);
    });

    it('should call getStartPage after updating userSettings', () => {
      const getStartPageSpy = jest.spyOn(service, 'getStartPage');
      jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(of({} as UserSettings));

      (service as any).loadUserSettings();

      expect(getStartPageSpy).toHaveBeenCalled();
    });

    it('should set settingsLoaded$ to true after loading user settings', () => {
      jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(of({} as UserSettings));

      (service as any).loadUserSettings();

      expect(service.settingsLoaded$.value).toBe(true);
    });

    it('should handle errors gracefully and set settingsLoaded$ to true', () => {
      jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(throwError(() => new Error('any error')));

      (service as any).loadUserSettings();

      expect(service.settingsLoaded$.value).toBe(true);
    });
  });

  describe('getStartPage', () => {
    it('should return the configured start page if available', () => {
      const startPage = 'configuredStartPage' as any;
      service.userSettings.set({
        systemMessage: null,
        startPage,
        demandValidation: null,
        overviewPage: null,
      });

      service.getStartPage().subscribe((page) => {
        expect(page).toBe(startPage);
      });
    });

    it('should return the default start page based on region if not configured', () => {
      service.userSettings.set({
        systemMessage: null,
        startPage: null,
        demandValidation: null,
        overviewPage: null,
      });
      service.region.set(Region.Europe);

      service.getStartPage().subscribe((page) => {
        expect(page).toBe(AppRoutePath.OverviewPage);
      });
    });
  });

  describe('updateDemandValidationUserSettings', () => {
    it('should update the workbench settings when the key is Workbench', () => {
      const currentSettings = {
        [UserSettingsKey.DemandValidation]: {
          [DemandValidationUserSettingsKey.Workbench]: {
            [SelectedKpisAndMetadata.Deliveries]: false,
          },
        },
      };
      service.userSettings.set(currentSettings as any);

      service.updateDemandValidationUserSettings(
        DemandValidationUserSettingsKey.Workbench,
        { [SelectedKpisAndMetadata.Deliveries]: true } as any
      );

      const updatedSettings = service.userSettings();
      expect(
        updatedSettings?.[UserSettingsKey.DemandValidation]?.[
          DemandValidationUserSettingsKey.Workbench
        ]
      ).toEqual({
        [SelectedKpisAndMetadata.Deliveries]: true,
      });
    });

    it('should update the timeRange settings when the key is TimeRange', () => {
      const currentSettings = {
        [UserSettingsKey.DemandValidation]: {
          [DemandValidationUserSettingsKey.TimeRange]: {
            [DemandValidationTimeRangeUserSettingsKey.Type]:
              DateRangePeriod.Weekly,
          },
        },
      };
      service.userSettings.set(currentSettings as any);

      service.updateDemandValidationUserSettings(
        DemandValidationUserSettingsKey.TimeRange,
        {
          [DemandValidationTimeRangeUserSettingsKey.Type]:
            DateRangePeriod.Monthly,
        } as any
      );

      const updatedSettings = service.userSettings();
      expect(
        updatedSettings?.[UserSettingsKey.DemandValidation]?.[
          DemandValidationUserSettingsKey.TimeRange
        ]
      ).toEqual({
        [DemandValidationTimeRangeUserSettingsKey.Type]:
          DateRangePeriod.Monthly,
      });
    });

    it('should update the exports array when the key is Exports', () => {
      const currentSettings = {
        [UserSettingsKey.DemandValidation]: {
          [DemandValidationUserSettingsKey.Exports]: [],
        } as any,
      };
      service.userSettings.set(currentSettings as any);

      const newExports = [
        { name: 'Export 1', type: 'excel' },
        { name: 'Export 2', type: 'csv' },
      ];

      service.updateDemandValidationUserSettings(
        DemandValidationUserSettingsKey.Exports,
        newExports as any
      );

      const updatedSettings = service.userSettings();
      expect(
        updatedSettings?.[UserSettingsKey.DemandValidation]?.[
          DemandValidationUserSettingsKey.Exports
        ]
      ).toEqual(newExports);
    });

    it('should preserve existing workbench and timeRange settings when updating exports', () => {
      const currentSettings = {
        [UserSettingsKey.DemandValidation]: {
          [DemandValidationUserSettingsKey.Workbench]: {
            [SelectedKpisAndMetadata.Deliveries]: true,
          },
          [DemandValidationUserSettingsKey.TimeRange]: {
            [DemandValidationTimeRangeUserSettingsKey.Type]:
              DateRangePeriod.Monthly,
          },
          [DemandValidationUserSettingsKey.Exports]: [],
        } as any,
      };
      service.userSettings.set(currentSettings as any);

      const newExports = [{ name: 'Export 1', type: 'excel' }];

      service.updateDemandValidationUserSettings(
        DemandValidationUserSettingsKey.Exports,
        newExports as any
      );

      const updatedSettings = service.userSettings();
      expect(
        updatedSettings?.[UserSettingsKey.DemandValidation]?.[
          DemandValidationUserSettingsKey.Workbench
        ]
      ).toEqual({
        [SelectedKpisAndMetadata.Deliveries]: true,
      });

      expect(
        updatedSettings?.[UserSettingsKey.DemandValidation]?.[
          DemandValidationUserSettingsKey.TimeRange
        ]
      ).toEqual({
        [DemandValidationTimeRangeUserSettingsKey.Type]:
          DateRangePeriod.Monthly,
      });

      expect(
        updatedSettings?.[UserSettingsKey.DemandValidation]?.[
          DemandValidationUserSettingsKey.Exports
        ]
      ).toEqual(newExports);
    });

    it('should create an empty exports array when updating other settings if no exports exist', () => {
      service.userSettings.set(null);

      service.updateDemandValidationUserSettings(
        DemandValidationUserSettingsKey.Workbench,
        { [SelectedKpisAndMetadata.Deliveries]: true } as any
      );

      const updatedSettings = service.userSettings();
      expect(
        updatedSettings?.[UserSettingsKey.DemandValidation]?.[
          DemandValidationUserSettingsKey.Exports
        ]
      ).toEqual([]);
    });

    it('should call updateUserSettings with the correct key and value', () => {
      const updateUserSettingsSpy = jest.spyOn(service, 'updateUserSettings');

      service.updateDemandValidationUserSettings(
        DemandValidationUserSettingsKey.Workbench,
        { [SelectedKpisAndMetadata.Deliveries]: true } as any
      );

      expect(updateUserSettingsSpy).toHaveBeenCalledWith(
        UserSettingsKey.DemandValidation,
        expect.objectContaining({
          workbench: expect.any(Object),
          timeRange: expect.any(Object),
        })
      );
    });
  });
});
