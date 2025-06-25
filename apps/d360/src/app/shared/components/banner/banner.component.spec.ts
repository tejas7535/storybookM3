import { AlertType } from '../../../pages/admin/banner-settings/banner-settings.component';
import { Stub } from '../../test/stub.class';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;

  beforeEach(() => {
    component = Stub.getForEffect<BannerComponent>({
      component: BannerComponent,
      providers: [Stub.getUserServiceProvider()],
    });

    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('state changes', () => {
    it('should update state when settings are loaded', () => {
      const mockSettings = {
        message: 'Test message',
        headline: 'Test headline',
        contentHash: 'abc123',
        type: 'INFO',
        active: true,
        closable: true,
      };

      const userService = component['userService'];
      jest.spyOn(userService, 'userSettings').mockReturnValue({
        systemMessage: mockSettings,
      } as any);

      userService.settingsLoaded$.next(true);

      Stub.detectChanges();

      expect(component['message']()).toBe('Test message');
      expect(component['headline']()).toBe('Test headline');
      expect(component['contentHash']()).toBe('abc123');
      expect(component['type']()).toBe('info');
      expect(component['active']()).toBe(true);
      expect(component['button']()).toBe('button.close');
    });

    it('should set banner as inactive when required conditions are not met', () => {
      jest.spyOn(component['userService'], 'userSettings').mockReturnValue({
        systemMessage: {
          active: false,
          message: 'Test message',
          headline: 'Test headline',
          contentHash: 'abc123',
          type: 'INFO' as AlertType,
        },
      } as any);

      component['userService'].settingsLoaded$.next(true);
      Stub.detectChanges();

      expect(component['isActive']()).toBeFalsy();
    });

    it('should set banner as active when all required conditions are met', () => {
      jest.spyOn(component['userService'], 'userSettings').mockReturnValue({
        systemMessage: {
          active: true,
          message: 'Test message',
          headline: 'Test headline',
          contentHash: 'abc123',
          type: 'INFO' as AlertType,
        },
      } as any);

      component['userService'].settingsLoaded$.next(true);
      Stub.detectChanges();

      expect(component['isActive']()).toBeTruthy();
    });

    it('should reset state when contentHash changes', () => {
      jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {});
      component['storedContentHash'].set('old-hash');

      jest.spyOn(component['userService'], 'userSettings').mockReturnValue({
        systemMessage: {
          contentHash: 'new-hash',
          active: true,
        },
      } as any);

      component['userService'].settingsLoaded$.next(true);
      Stub.detectChanges();

      expect(localStorage.removeItem).toHaveBeenCalledWith('closedBannerHash');
      expect(component['storedContentHash']()).toBeNull();
    });

    it('should not show banner when contentHash matches storedContentHash', () => {
      const hash = 'same-hash';
      component['storedContentHash'].set(hash);
      component['contentHash'].set(hash);

      expect(component['isActive']()).toBeFalsy();
    });
  });

  describe('ngOnInit', () => {
    it('should initialize with default state', () => {
      component.ngOnInit();

      expect(component['isActive']()).toBeFalsy();
      expect(component['type']()).toBeNull();
      expect(component['message']()).toBeNull();
      expect(component['headline']()).toBeNull();
      expect(component['button']()).toBeNull();
    });
  });

  describe('onButtonClicked', () => {
    it('should save contentHash to localStorage when button is clicked', () => {
      const mockContentHash = 'abc123';
      component['contentHash'].set(mockContentHash);
      const localStorageSpy = jest.spyOn(localStorage, 'setItem');

      component['onButtonClicked']();

      expect(localStorageSpy).toHaveBeenCalledWith(
        'closedBannerHash',
        mockContentHash
      );
      expect(component['storedContentHash']()).toBe(mockContentHash);
    });
  });

  describe('Banner functionality', () => {
    it('should initialize storedContentHash from localStorage on init', () => {
      const mockStoredHash = 'stored-hash-123';
      jest.spyOn(localStorage, 'getItem').mockReturnValue(mockStoredHash);

      component.ngOnInit();

      expect(component['storedContentHash']()).toBe(mockStoredHash);
    });

    it('should handle null settings gracefully', () => {
      jest
        .spyOn(component['userService'], 'userSettings')
        .mockReturnValue(null);

      component['userService'].settingsLoaded$.next(true);
      Stub.detectChanges();

      expect(component['message']()).toBeNull();
      expect(component['headline']()).toBeNull();
      expect(component['contentHash']()).toBeNull();
      expect(component['type']()).toBeNull();
      expect(component['active']()).toBeFalsy();
    });

    it('should handle undefined systemMessage settings gracefully', () => {
      jest
        .spyOn(component['userService'], 'userSettings')
        .mockReturnValue({} as any);

      component['userService'].settingsLoaded$.next(true);
      Stub.detectChanges();

      expect(component['message']()).toBeNull();
      expect(component['headline']()).toBeNull();
      expect(component['contentHash']()).toBeNull();
      expect(component['type']()).toBeNull();
      expect(component['active']()).toBeFalsy();
    });

    it('should not show banner when type is null', () => {
      component['active'].set(true);
      component['message'].set('Test message');
      component['headline'].set('Test headline');
      component['type'].set(null);

      expect(component['isActive']()).toBeFalsy();
    });

    it('should not show banner when both headline and message are null', () => {
      component['active'].set(true);
      component['message'].set(null);
      component['headline'].set(null);
      component['type'].set('info');

      expect(component['isActive']()).toBeFalsy();
    });

    it('should show banner when type and message are present', () => {
      component['active'].set(true);
      component['message'].set('Test message');
      component['headline'].set(null);
      component['type'].set('info');
      component['contentHash'].set('hash1');
      component['storedContentHash'].set('hash2'); // Different hash

      expect(component['isActive']()).toBeTruthy();
    });

    it('should show banner when type and headline are present', () => {
      component['active'].set(true);
      component['message'].set(null);
      component['headline'].set('Test headline');
      component['type'].set('info');
      component['contentHash'].set('hash1');
      component['storedContentHash'].set('hash2'); // Different hash

      expect(component['isActive']()).toBeTruthy();
    });

    it('should set button text to null when closable is false', () => {
      jest.spyOn(component['userService'], 'userSettings').mockReturnValue({
        systemMessage: {
          active: true,
          message: 'Test message',
          headline: 'Test headline',
          closable: false,
        },
      } as any);

      component['userService'].settingsLoaded$.next(true);
      Stub.detectChanges();

      expect(component['button']()).toBeNull();
    });
  });
});
