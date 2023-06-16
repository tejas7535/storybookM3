import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { LOCALE_DE } from '../../constants';
import { ComparatorService } from './comparator.service';
describe('ComparatorService', () => {
  let service: ComparatorService;
  let spectator: SpectatorService<ComparatorService>;

  const createService = createServiceFactory({
    service: ComparatorService,
    providers: [
      {
        provide: TranslocoLocaleService,
        useValue: {
          getLocale: jest.fn(() => LOCALE_DE.id),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('compareDate Desc', () => {
    test('return 1 when a < b', () => {
      const result = service.compareTranslocoDateDesc('23.01.23', '25.01.23');
      expect(result).toBe(1);
    });
    test('return 0 when a = b', () => {
      const result = service.compareTranslocoDateDesc('25.01.23', '25.01.23');
      expect(result).toBe(0);
    });
    test('return -1 when a > b', () => {
      const result = service.compareTranslocoDateDesc('25.01.23', '23.01.23');
      expect(result).toBe(-1);
    });
    test('return -1 when a is null and b is set', () => {
      const result = service.compareTranslocoDateDesc(undefined, '25.01.23');
      expect(result).toBe(-1);
    });
    test('return -1 when a is "-" and b is set', () => {
      const result = service.compareTranslocoDateDesc('-', '25.01.23');
      expect(result).toBe(-1);
    });
    test('return 1 when b is null and a is set', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = service.compareTranslocoDateDesc('25.01.23', undefined);
      expect(result).toBe(1);
    });

    test('return 1 when b is "-" and a is set', () => {
      const result = service.compareTranslocoDateDesc('25.01.23', '-');
      expect(result).toBe(1);
    });
    test('return 0 when a and b are "-"', () => {
      const result = service.compareTranslocoDateDesc('-', '-');
      expect(result).toBe(0);
    });

    test('return 0 when a and b are null', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = service.compareTranslocoDateDesc(undefined, undefined);
      expect(result).toBe(0);
    });
  });

  describe('compareDate Asc', () => {
    test('return -1 when a < b', () => {
      const result = service.compareTranslocoDateAsc('23.01.23', '25.01.23');
      expect(result).toBe(-1);
    });
    test('return 0 when a = b', () => {
      const result = service.compareTranslocoDateAsc('25.01.23', '25.01.23');
      expect(result).toBe(0);
    });
    test('return 1 when a > b', () => {
      const result = service.compareTranslocoDateAsc('25.01.23', '23.01.23');
      expect(result).toBe(1);
    });
    test('return 1 when a is null and b is set', () => {
      const result = service.compareTranslocoDateAsc(undefined, '25.01.23');
      expect(result).toBe(1);
    });
    test('return 1 when a is "-" and b is set', () => {
      const result = service.compareTranslocoDateAsc('-', '25.01.23');
      expect(result).toBe(1);
    });
    test('return -1 when b is null and a is set', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = service.compareTranslocoDateAsc('25.01.23', undefined);
      expect(result).toBe(-1);
    });

    test('return -1 when b is "-" and a is set', () => {
      const result = service.compareTranslocoDateAsc('25.01.23', '-');
      expect(result).toBe(-1);
    });
    test('return 0 when a and b are "-"', () => {
      const result = service.compareTranslocoDateAsc('-', '-');
      expect(result).toBe(0);
    });

    test('return 0 when a and b are null', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = service.compareTranslocoDateAsc(undefined, undefined);
      expect(result).toBe(0);
    });
  });
});
