import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { StaticPlatformLocation } from './static-platform-location';

describe('StaticPlatformLocation', () => {
  let staticPlatformLocation: StaticPlatformLocation;
  let spectator: SpectatorService<StaticPlatformLocation>;

  const createService = createServiceFactory({
    service: StaticPlatformLocation,
  });

  beforeEach(() => {
    spectator = createService();
    staticPlatformLocation = spectator.service;
  });

  it('should create', () => {
    expect(staticPlatformLocation).toBeTruthy();
  });

  describe('get pathname', () => {
    it('should return empty string if no state is present', () => {
      expect(staticPlatformLocation.pathname).toBe('');
    });

    it('should return pathname from history state', () => {
      const testUrl = '/test/path';
      staticPlatformLocation['history'].replaceState({ url: testUrl }, '');
      expect(staticPlatformLocation.pathname).toBe(testUrl);
    });
  });

  describe('pushState', () => {
    beforeEach(() => {
      staticPlatformLocation['history'].pushState = jest.fn();
    });

    it('should call history.pushState with correct parameters', () => {
      const state = { some: 'state' };
      const title = 'Test Title';
      const url = '/test/push';

      staticPlatformLocation.pushState(state, title, url);

      expect(staticPlatformLocation['history'].pushState).toHaveBeenCalledWith(
        { ...state, url },
        title
      );
    });
  });

  describe('replaceState', () => {
    beforeEach(() => {
      staticPlatformLocation['history'].replaceState = jest.fn();
    });

    it('should call history.replaceState with correct parameters', () => {
      const state = { some: 'state' };
      const title = 'Test Title';
      const url = '/test/replace';

      staticPlatformLocation.replaceState(state, title, url);

      expect(
        staticPlatformLocation['history'].replaceState
      ).toHaveBeenCalledWith({ ...state, url }, title);
    });
  });
});
