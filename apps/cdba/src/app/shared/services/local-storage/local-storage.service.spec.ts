import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LocalStorageMock } from '@cdba/testing/mocks';

import { LocalStorageService } from './local-storage.service';

interface Mock {
  name: string;
}

describe('LocalStorageService', () => {
  let spectator: SpectatorService<LocalStorageService>;
  let service: LocalStorageService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: LocalStorageService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(LocalStorageService);
    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;

    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should setItem with primitive', () => {
      const key = 'testKey';
      const value = 5;

      service.setItem(key, value, false);

      expect(localStorage.getItem(key)).toEqual(5);
    });

    it('should setItem with an Object', () => {
      const key = 'testKey';
      const value = { name: 'test' };

      service.setItem(key, value, true);

      expect(localStorage.getItem(key)).toEqual('{"name":"test"}');
    });

    it('should not setItem when value is undefined', () => {
      const spy = jest.spyOn(localStorage, 'setItem');

      service.setItem('testKey', undefined, true);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('getItem', () => {
    it('should getItem', () => {
      const key = 'testKey';
      const value = 'value';
      localStorage.setItem(key, value);

      const result = service.getItem<string>(key, false);

      expect(result).toEqual(value);
    });

    it('should clear key and throw error when parsing fails', () => {
      const key = 'testKey';
      const invalidJson = '{ aaa: "aaa" }';

      localStorage.setItem(key, invalidJson);

      let result;
      expect(() => {
        result = service.getItem<Mock>(key, true);
      }).toThrow(
        'Error parsing item for key: testKey from localStorage: SyntaxError'
      );

      expect(result).toBeUndefined();
      expect(localStorage.getItem(key)).toBeUndefined();
    });

    it('should return undefined when item does not exist', () => {
      const key = 'nonExistentKey';

      const result = service.getItem<string>(key, false);

      expect(result).toBeUndefined();
    });

    it('should return parsed item', () => {
      const key = 'test';
      const value = { name: 'test' };
      localStorage.setItem(key, JSON.stringify(value));

      const result = service.getItem<Mock>(key, true);

      expect(result).toEqual({ name: 'test' } as Mock);
    });
  });

  describe('clear', () => {
    it('should clear localStorage', () => {
      localStorage.setItem('testKey', JSON.stringify({ name: 'test' }));
      expect(localStorage.getItem('testKey')).toBeDefined();

      service.clear();

      expect(localStorage.getItem('testKey')).toBeUndefined();
    });
  });
});
