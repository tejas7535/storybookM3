import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { ProcessCaseFacade } from '@gq/core/store/process-case';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { when } from 'jest-when';

import { LOCALE_DE, LOCALE_EN } from '../../constants';
import { MaterialTableItem, ValidationDescription } from '../../models/table';
import { PasteMaterialsService } from './paste-materials.service';

describe('PasteMaterialsService', () => {
  let service: PasteMaterialsService;
  let spectator: SpectatorService<PasteMaterialsService>;
  let combinedArray: MaterialTableItem[];
  let combinedArrayWithTargetPrice: MaterialTableItem[];
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: PasteMaterialsService,
    imports: [MatSnackBarModule],
    providers: [
      provideMockStore({}),
      mockProvider(TranslocoLocaleService),
      mockProvider(CreateCaseFacade),
      mockProvider(ProcessCaseFacade),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    snackBar = spectator.inject(MatSnackBar);
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('onPasteStart', () => {
    beforeEach(() => {
      combinedArray = [
        {
          materialNumber: '20',
          customerMaterialNumber: '',
          quantity: 10,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '201',
          customerMaterialNumber: '',
          quantity: 20,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '203',
          customerMaterialNumber: '',
          quantity: 30,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];

      combinedArrayWithTargetPrice = [
        {
          materialNumber: '20',
          customerMaterialNumber: '',
          quantity: 10,
          targetPrice: 10.05,
          targetPriceSource: 'INTERNAL',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '201',
          customerMaterialNumber: '',
          quantity: 20,
          targetPrice: 1000.05,
          targetPriceSource: 'INTERNAL',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '203',
          customerMaterialNumber: '',
          quantity: 30,
          targetPrice: 100_000.05,
          targetPriceSource: 'INTERNAL',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];
    });
    test('should dispatch action with transformed array', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);

      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise((resolve) => resolve(`20\t\t10\n201\t\t20\n203\t\t30`)),
        },
      });

      await service.onPasteStart(true, true);

      expect(service['createCaseFacade'].addRowDataItems).toHaveBeenCalledWith(
        combinedArray
      );
    });

    test('should dispatch action with transformed array with target price ger locale input used', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);

      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise((resolve) =>
              resolve(
                `20\t\t10\t10,05\n201\t\t20\t1000,05\n203\t\t30\t100.000,05`
              )
            ),
        },
      });

      const combinedItem = combinedArrayWithTargetPrice;

      await service.onPasteStart(true, true);

      expect(service['createCaseFacade'].addRowDataItems).toHaveBeenCalledWith(
        combinedItem
      );
    });

    test('should dispatch action with transformed array with rounded target price', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);

      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise((resolve) =>
              resolve(
                `20\t\t10\t10,05413333\n201\t\t20\t1000,04974555\n203\t\t30\t100.000,046123`
              )
            ),
        },
      });

      await service.onPasteStart(true, true);

      expect(service['createCaseFacade'].addRowDataItems).toHaveBeenCalledWith(
        combinedArrayWithTargetPrice
      );
    });

    test('should dispatch action with transformed array with target price eng locale input used', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_EN.id);

      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise((resolve) =>
              resolve(
                `20\t\t10\t10.05\n201\t\t20\t1000.05\n203\t\t30\t100,000.05`
              )
            ),
        },
      });

      await service.onPasteStart(true, true);

      expect(service['createCaseFacade'].addRowDataItems).toHaveBeenCalledWith(
        combinedArrayWithTargetPrice
      );
    });

    test('should dispatch action with transformed array with target price and targetPriceSource provided set', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_EN.id);

      when(translate)
        .calledWith(
          `shared.caseMaterial.addEntry.targetPriceSource.valuesForPaste.${TargetPriceSource.INTERNAL}`,
          { lang: 'de' }
        )
        .mockReturnValue('Intern');
      when(translate)
        .calledWith(
          `shared.caseMaterial.addEntry.targetPriceSource.valuesForPaste.${TargetPriceSource.INTERNAL}`,
          { lang: 'en' }
        )
        .mockReturnValue('Internal');
      when(translate)
        .calledWith(
          `shared.caseMaterial.addEntry.targetPriceSource.valuesForPaste.${TargetPriceSource.CUSTOMER}`,
          { lang: 'de' }
        )
        .mockReturnValue('Kunde');
      when(translate)
        .calledWith(
          `shared.caseMaterial.addEntry.targetPriceSource.valuesForPaste.${TargetPriceSource.CUSTOMER}`,
          { lang: 'en' }
        )
        .mockReturnValue('Customer');
      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise((resolve) =>
              resolve(
                `20\t\t10\t10.05\tinternal\n201\t\t20\t1000.05\tkunde\n203\t\t30\t100,000.05\tstupidTargetPriceSource`
              )
            ),
        },
      });

      await service.onPasteStart(true, true);
      combinedArrayWithTargetPrice[1].targetPriceSource = 'CUSTOMER';

      expect(service['createCaseFacade'].addRowDataItems).toHaveBeenCalledWith(
        combinedArrayWithTargetPrice
      );
    });

    test('should dispatch action german locale', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);

      Object.assign(navigator, {
        clipboard: {
          readText: () => new Promise((resolve) => resolve(`20\t\t1.000`)),
        },
      });

      const combinedItem = [
        {
          materialNumber: '20',
          customerMaterialNumber: '',
          quantity: 1000,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];

      await service.onPasteStart(true, true);

      expect(service['createCaseFacade'].addRowDataItems).toHaveBeenCalledWith(
        combinedItem
      );
    });
    test('should dispatch action english locale', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_EN.id);

      Object.assign(navigator, {
        clipboard: {
          readText: () => new Promise((resolve) => resolve(`20\t\t1,000`)),
        },
      });

      const combinedItem = [
        {
          materialNumber: '20',
          customerMaterialNumber: '',
          quantity: 1000,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];

      await service.onPasteStart(true, true);

      expect(service['createCaseFacade'].addRowDataItems).toHaveBeenCalledWith(
        combinedItem
      );
    });
    test('should dispatch action with transformed array for processCase view', async () => {
      // Test case of last line being empty
      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise((resolve) =>
              resolve(`20\t\t10\n201\t\t20\n203\t\t30\n`)
            ),
        },
      });

      await service.onPasteStart(false, true);

      expect(
        service['processCaseFacade'].addItemsToMaterialTable
      ).toHaveBeenCalledWith(combinedArray);
    });
    test('should dispatch action with transformed array for zero quantity', async () => {
      Object.assign(navigator, {
        clipboard: {
          readText: () => new Promise((resolve) => resolve(`20\t`)),
        },
      });

      await service.onPasteStart(false, true);
      expect(
        service['processCaseFacade'].addItemsToMaterialTable
      ).toHaveBeenCalledWith([
        {
          materialNumber: '20',
          quantity: 1,
          customerMaterialNumber: '',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        } as MaterialTableItem,
      ]);
    });

    test('should show snackBar if pasting is disabled', async () => {
      snackBar.open = jest.fn();
      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise(() => {
              throw new Error('test');
            }),
        },
      });

      await service.onPasteStart(false, false);

      expect(snackBar.open).toHaveBeenCalledTimes(1);
      expect(snackBar.open).toHaveBeenCalledWith(
        translate(`shared.snackBarMessages.pasteDisabled`)
      );
      expect(
        service['processCaseFacade'].addItemsToMaterialTable
      ).not.toHaveBeenCalled();
    });
  });
});
