import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MobileKeyboardVisibilityService } from './mobile-keyboard-visibility.service';

const isNativePlatformMock = jest.fn();
Capacitor.isNativePlatform = isNativePlatformMock;

jest.mock('@capacitor/keyboard', () => ({
  Keyboard: {
    addListener: jest.fn((event, callback) => {
      if (event === 'keyboardWillShow') {
        callback();
      } else if (event === 'keyboardWillHide') {
        callback();
      }

      return { remove: jest.fn() };
    }),
    removeAllListeners: jest.fn(),
    setAccessoryBarVisible: jest.fn(),
  },
}));

describe('MobileKeyboardVisibilityService', () => {
  let spectator: SpectatorService<MobileKeyboardVisibilityService>;
  const createService = createServiceFactory(MobileKeyboardVisibilityService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when is native platform', () => {
    let keyboardWillShowCallback: () => void;
    let keyboardWillHideCallback: () => void;

    beforeEach(() => {
      isNativePlatformMock.mockReturnValue(true);
      spectator = createService();

      (Keyboard.addListener as jest.Mock).mockImplementation(
        (event, callback) => {
          if (event === 'keyboardWillShow') {
            keyboardWillShowCallback = callback;
          } else if (event === 'keyboardWillHide') {
            keyboardWillHideCallback = callback;
          }

          return { remove: jest.fn() };
        }
      );
    });

    it('should be created', () => {
      expect(spectator.service).toBeTruthy();
    });

    it('should set accessory bar visible', () => {
      expect(Keyboard.setAccessoryBarVisible).toHaveBeenCalledWith({
        isVisible: true,
      });
    });

    it('should update isKeyboardVisibleSubject when keyboardWillShow event is triggered', () => {
      const isKeyboardVisible$ = spectator.service.isKeyboardVisible$;
      let isVisible: boolean | undefined;
      isKeyboardVisible$.subscribe((visible) => (isVisible = visible));

      keyboardWillShowCallback();

      expect(isVisible).toBe(true);
    });

    it('should update isKeyboardVisibleSubject when keyboardWillHide event is triggered', () => {
      const isKeyboardVisible$ = spectator.service.isKeyboardVisible$;
      let isVisible: boolean | undefined;
      isKeyboardVisible$.subscribe((visible) => (isVisible = visible));

      // Trigger the keyboardWillHide event
      keyboardWillHideCallback();

      expect(isVisible).toBe(false);
    });

    it('should clean up on ngOnDestroy', () => {
      const removeAllListenersSpy = jest.spyOn(Keyboard, 'removeAllListeners');

      spectator.service.ngOnDestroy();

      expect(removeAllListenersSpy).toHaveBeenCalled();
    });
  });

  describe('when is mobile web platform', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      isNativePlatformMock.mockReturnValue(false);
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1',
        writable: true,
      });

      Object.defineProperty(window, 'visualViewport', {
        value: {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        },
        writable: true,
      });

      Object.defineProperty(window, 'innerHeight', {
        value: 800,
        writable: true,
      });

      spectator = createService();
    });

    it('should add resize listener', () => {
      const addListenerSpy = jest.spyOn(
        window.visualViewport,
        'addEventListener'
      );

      expect(addListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should clean up on ngOnDestroy', () => {
      const removeEventListenerSpy = jest.spyOn(
        window.visualViewport,
        'removeEventListener'
      );

      spectator.service.ngOnDestroy();

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('should update isKeyboardVisibleSubject when keyboard is visible', () => {
      const isKeyboardVisible$ = spectator.service.isKeyboardVisible$;
      let isVisible: boolean | undefined;
      isKeyboardVisible$.subscribe((visible) => (isVisible = visible));

      const handleResize = (window.visualViewport.addEventListener as jest.Mock)
        .mock.calls[0][1];

      handleResize({ target: { height: 100 } });

      expect(isVisible).toBe(true);
    });

    it('should update isKeyboardVisibleSubject when keyboard is not visible', () => {
      const isKeyboardVisible$ = spectator.service.isKeyboardVisible$;
      let isVisible: boolean | undefined;
      isKeyboardVisible$.subscribe((visible) => (isVisible = visible));

      const handleResize = (window.visualViewport.addEventListener as jest.Mock)
        .mock.calls[0][1];

      handleResize({ target: { height: 800 } });

      expect(isVisible).toBe(false);
    });
  });

  describe('when is not native mobile platform', () => {
    beforeEach(() => {
      isNativePlatformMock.mockReturnValue(false);

      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Widnows95; CPU intel ) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1',
        writable: true,
      });

      Object.defineProperty(window, 'visualViewport', {
        value: {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        },
        writable: true,
      });

      spectator = createService();
    });

    it('should not add any subscription', () => {
      const addListenerSpy = jest.spyOn(Keyboard, 'addListener');

      expect(addListenerSpy).not.toHaveBeenCalled();
    });

    it('should not clean up on ngOnDestroy', () => {
      const removeAllListenersSpy = jest.spyOn(Keyboard, 'removeAllListeners');

      spectator.service.ngOnDestroy();

      expect(removeAllListenersSpy).not.toHaveBeenCalled();
    });

    it('should not add resize listener', () => {
      const addListenerSpy = jest.spyOn(
        window.visualViewport,
        'addEventListener'
      );

      expect(addListenerSpy).not.toHaveBeenCalled();
    });

    it('should not remove resize listener', () => {
      const removeEventListenerSpy = jest.spyOn(
        window.visualViewport,
        'removeEventListener'
      );

      spectator.service.ngOnDestroy();

      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });
  });
});
