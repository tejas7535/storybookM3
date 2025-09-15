import { signal } from '@angular/core';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EaEmbeddedService } from './ea-embedded.service';

describe('EaEmbeddedService', () => {
  let service: EaEmbeddedService;
  let spectator: SpectatorService<EaEmbeddedService>;

  const createService = createServiceFactory({
    service: EaEmbeddedService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('uninitialized', () => {
    it('should throw if accessed before initialization', () => {
      expect(() => service.bearing).toThrow(
        'EaEmbeddedService not initialized'
      );
      expect(() => service.language).toThrow(
        'EaEmbeddedService not initialized'
      );
      expect(() => service.userTier).toThrow(
        'EaEmbeddedService not initialized'
      );
      expect(() => service.isStandalone).toThrow(
        'EaEmbeddedService not initialized'
      );
    });
  });

  describe('initialized', () => {
    beforeEach(() => {
      const mockBearing = signal('6226');
      const mockLanguage = signal('en');
      const mockUserTier = signal('anonymous');

      service.initialize(mockBearing, mockLanguage, mockUserTier);
    });

    it('should return the correct bearing', () => {
      expect(service.bearing()).toBe('6226');
    });

    it('should return the correct language', () => {
      expect(service.language()).toBe('en');
    });

    it('should return the correct user tier', () => {
      expect(service.userTier()).toBe('anonymous');
    });

    it('should return false for isStandalone when bearing is set', () => {
      expect(service.isStandalone()).toBe(false);
    });

    it('should not re-initialize if initialize is called again', () => {
      const newMockBearing = signal('6226-2');
      const newMockLanguage = signal('de');
      const newMockUserTier = signal('plus');

      service.initialize(newMockBearing, newMockLanguage, newMockUserTier);

      expect(service.bearing()).toBe('6226');
      expect(service.language()).toBe('en');
      expect(service.userTier()).toBe('anonymous');
    });
  });

  describe('initialized with empty bearing', () => {
    beforeEach(() => {
      const mockBearing = signal('');
      const mockLanguage = signal('en');
      const mockUserTier = signal('anonymous');

      service.initialize(mockBearing, mockLanguage, mockUserTier);
    });

    it('should return true for isStandalone when bearing is empty', () => {
      expect(service.isStandalone()).toBe(true);
    });
  });

  describe('initialized with undefined bearing', () => {
    beforeEach(() => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const mockBearing = signal<string | undefined>(undefined);
      const mockLanguage = signal('en');
      const mockUserTier = signal('anonymous');

      service.initialize(mockBearing, mockLanguage, mockUserTier);
    });

    it('should return true for isStandalone when bearing is undefined', () => {
      expect(service.isStandalone()).toBe(true);
    });
  });
});
