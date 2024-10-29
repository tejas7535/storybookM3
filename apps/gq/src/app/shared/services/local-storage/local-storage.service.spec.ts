import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LocalStorageService } from './local-storage.service';
class LocalStorageMock {
  public store: { [key: string]: string } = {};

  setStore(store: { [key: string]: string }): void {
    this.store = store;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string {
    // eslint-disable-next-line unicorn/no-null
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}
describe('LocalStorageService', () => {
  describe('LocalStorageService', () => {
    let spectator: SpectatorService<LocalStorageService>;
    let service: LocalStorageService;
    let localStorage: LocalStorageMock;

    const createService = createServiceFactory({
      service: LocalStorageService,
      providers: [{ provide: LOCAL_STORAGE, useValue: LocalStorageMock }],
    });

    beforeEach(() => {
      spectator = createService();
      service = spectator.service;
      localStorage = spectator.inject(
        LOCAL_STORAGE
      ) as unknown as LocalStorageMock;

      localStorage.clear = jest.fn();
      localStorage.setItem = jest.fn();
      localStorage.getItem = jest.fn();
    });

    test('should be created', () => {
      expect(service).toBeTruthy();
    });
    test('should set', () => {
      service.setToLocalStorage('key', 'value');
      expect(localStorage.setItem).toHaveBeenCalledWith('key', '"value"');
    });

    test('should get', () => {
      localStorage.getItem = jest.fn().mockReturnValue('"value"');
      service.getFromLocalStorage('key');
      expect(localStorage.getItem).toHaveBeenCalledWith('key');
    });
  });
});
