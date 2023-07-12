import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import {
  TranslocoLocaleModule,
  TranslocoLocaleService,
} from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Keyboard } from '../../models';
import { TransformationService } from './transformation.service';

describe('TransformationService', () => {
  let service: TransformationService;
  let spectator: SpectatorService<TransformationService>;

  const createService = createServiceFactory({
    service: TransformationService,
    providers: [TranslocoLocaleService],
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      TranslocoLocaleModule.forRoot(),
    ],
    declarations: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('transformNumber', () => {
    test('should localize decimal number without digits', () => {
      const result = service.transformNumber(12_345_678.912_345, false);

      expect(result).toEqual('12,345,679');
    });

    test('should localize decimal number with digits', () => {
      const result = service.transformNumber(12_345_678.912_345, true);

      expect(result).toEqual('12,345,678.91');
    });
    test('should return dash if undefined', () => {
      const result = service.transformNumber(undefined, false);

      expect(result).toEqual(Keyboard.DASH);
    });
  });

  describe('transformNumberExcel', () => {
    test('should localize decimal number', () => {
      const result = service.transformNumberExcel(12_345_678.912_345);

      expect(result).toEqual('12345678.91');
    });

    test('should return dash if undefined', () => {
      const result = service.transformNumber(undefined, false);

      expect(result).toEqual(Keyboard.DASH);
    });
  });

  describe('transformNumberCurrency', () => {
    test('should transform currency', () => {
      const result = service.transformNumberCurrency(10_000_000, 'EUR');

      expect(result).toEqual('EUR\u00A010,000,000.00');
    });

    test('should return dash if undefined', () => {
      const result = service.transformNumberCurrency(undefined, 'EUR');

      expect(result).toEqual(Keyboard.DASH);
    });
  });

  describe('transformPercentage', () => {
    test('should localize percentage', () => {
      const result = service.transformPercentage(25.711_234);

      expect(result).toEqual('25.71%');
    });

    test('should return dash if undefined', () => {
      const result = service.transformPercentage(undefined as any);

      expect(result).toEqual(Keyboard.DASH);
    });
  });

  describe('transformDate', () => {
    test('should localize date without time', () => {
      const result = service.transformDate('2022-06-22T13:45:30', false);

      expect(result).toEqual('06/22/22');
    });

    test('should localize with time', () => {
      const result = service.transformDate('2022-06-22T13:45:30', true);

      // needed to ensure equality on each env -> remove spaces
      const formattedResult = result
        .replace('\u202F', ' ')
        .replace('\u00A0', ' ');

      expect(formattedResult).toEqual('06/22/22, 01:45 PM');
    });
    test('should return empty if undefined', () => {
      const result = service.transformDate(undefined, false);

      expect(result).toEqual('');
    });
  });
});
