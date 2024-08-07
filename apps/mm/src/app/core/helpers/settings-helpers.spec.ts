import { detectAppDelivery } from './settings-helpers';

const { origin, top, self } = window;

const isNativePlatformMock = jest.fn();

describe('Settings helpers', () => {
  afterEach(() => {
    window.origin = origin;
    Object.defineProperty(window, 'top', { ...top, writable: true });
    Object.defineProperty(window, 'self', { ...self, writable: true });
  });

  describe('detectAppDelivery', () => {
    it('should return standalone', () => {
      expect(detectAppDelivery()).toBe('standalone');
    });

    it('should return embedded', () => {
      isNativePlatformMock.mockReturnValue(false);
      delete window.top;
      delete window.self;

      window.top = {} as WindowProxy;
      window.self = {} as Window & typeof globalThis;

      expect(detectAppDelivery()).toBe('embedded');
    });
  });
});
