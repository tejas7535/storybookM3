import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { addRowDataItems } from '@gq/core/store/actions/create-case/create-case.actions';
import { addMaterialRowDataItems } from '@gq/core/store/actions/process-case/process-case.action';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LOCALE_DE, LOCALE_EN } from '../../constants';
import { MaterialTableItem, ValidationDescription } from '../../models/table';
import { PasteMaterialsService } from './paste-materials.service';

describe('PasteMaterialsService', () => {
  let service: PasteMaterialsService;
  let spectator: SpectatorService<PasteMaterialsService>;
  let mockStore: MockStore;
  let combinedArray: MaterialTableItem[];
  let combinedArrayWithTargetPrice: MaterialTableItem[];
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: PasteMaterialsService,
    imports: [MatSnackBarModule],
    providers: [provideMockStore({}), mockProvider(TranslocoLocaleService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
    snackBar = spectator.inject(MatSnackBar);
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('onPasteStart', () => {
    beforeEach(() => {
      mockStore.dispatch = jest.fn();

      combinedArray = [
        {
          materialNumber: '20',
          quantity: 10,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '201',
          quantity: 20,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '203',
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
          quantity: 10,
          targetPrice: 10.05,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '201',
          quantity: 20,
          targetPrice: 1000.05,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '203',
          quantity: 30,
          targetPrice: 100_000.05,
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
            new Promise((resolve) => resolve(`20\t10\n201\t20\n203\t30`)),
        },
      });

      const combinedItem = {
        items: combinedArray,
      };
      await service.onPasteStart(true);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addRowDataItems(combinedItem)
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
              resolve(`20\t10\t10,05\n201\t20\t1000,05\n203\t30\t100.000,05`)
            ),
        },
      });

      const combinedItem = {
        items: combinedArrayWithTargetPrice,
      };
      await service.onPasteStart(true);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addRowDataItems(combinedItem)
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
              resolve(`20\t10\t10.05\n201\t20\t1000.05\n203\t30\t100,000.05`)
            ),
        },
      });

      const combinedItem = {
        items: combinedArrayWithTargetPrice,
      };
      await service.onPasteStart(true);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addRowDataItems(combinedItem)
      );
    });

    test('should dispatch action german locale', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);

      Object.assign(navigator, {
        clipboard: {
          readText: () => new Promise((resolve) => resolve(`20\t1.000`)),
        },
      });

      const combinedItem = {
        items: [
          {
            materialNumber: '20',
            quantity: 1000,
            info: {
              valid: false,
              description: [ValidationDescription.Not_Validated],
            },
          },
        ],
      };
      await service.onPasteStart(true);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addRowDataItems(combinedItem)
      );
    });
    test('should dispatch action english locale', async () => {
      service['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_EN.id);

      Object.assign(navigator, {
        clipboard: {
          readText: () => new Promise((resolve) => resolve(`20\t1,000`)),
        },
      });

      const combinedItem = {
        items: [
          {
            materialNumber: '20',
            quantity: 1000,
            info: {
              valid: false,
              description: [ValidationDescription.Not_Validated],
            },
          },
        ],
      };
      await service.onPasteStart(true);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addRowDataItems(combinedItem)
      );
    });
    test('should dispatch action with transformed array for processCase view', async () => {
      // Test case of last line being empty
      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise((resolve) => resolve(`20\t10\n201\t20\n203\t30\n`)),
        },
      });

      const combinedItem = {
        items: combinedArray,
      };
      await service.onPasteStart(false);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addMaterialRowDataItems(combinedItem)
      );
    });
    test('should dispatch action with transformed array for zero quantity', async () => {
      Object.assign(navigator, {
        clipboard: {
          readText: () =>
            new Promise((resolve) => resolve(`\t10\n201\t\n203\t30`)),
        },
      });

      combinedArray[0].materialNumber = '';
      combinedArray[1].quantity = 1;

      const combinedItem = {
        items: combinedArray,
      };
      await service.onPasteStart(false);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addMaterialRowDataItems(combinedItem)
      );
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

      await service.onPasteStart(true);

      expect(snackBar.open).toHaveBeenCalledTimes(1);
      expect(snackBar.open).toHaveBeenCalledWith(
        translate(`shared.snackBarMessages.pasteDisabled`)
      );
      expect(mockStore.dispatch).toHaveBeenCalledTimes(0);
    });
  });
});
