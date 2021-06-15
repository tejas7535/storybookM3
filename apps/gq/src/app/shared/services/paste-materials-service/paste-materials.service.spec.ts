import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  pasteRowDataItems,
  pasteRowDataItemsToAddMaterial,
} from '../../../core/store';
import { MaterialTableItem, ValidationDescription } from '../../models/table';
import { PasteMaterialsService } from './paste-materials.service';

describe('PasteMaterialsService', () => {
  let service: PasteMaterialsService;
  let spectator: SpectatorService<PasteMaterialsService>;
  let mockStore: MockStore;
  let combinedArray: MaterialTableItem[];

  const createService = createServiceFactory({
    service: PasteMaterialsService,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
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
    });
    test('should dispatch action with transformed array', async () => {
      Object.assign(navigator, {
        clipboard: {
          readText: () => `20\t10\n201\t20\n203\t30`,
        },
      });

      const combinedItem = {
        items: combinedArray,
      };
      await service.onPasteStart(true);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        pasteRowDataItems(combinedItem)
      );
    });
    test('should dispatch action with transformed array for processCase view', async () => {
      // Test case of last line being empty
      Object.assign(navigator, {
        clipboard: {
          readText: () => `20\t10\n201\t20\n203\t30\n`,
        },
      });

      const combinedItem = {
        items: combinedArray,
      };
      await service.onPasteStart(false);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        pasteRowDataItemsToAddMaterial(combinedItem)
      );
    });
    test('should dispatch action with transformed array for zero quantity', async () => {
      Object.assign(navigator, {
        clipboard: {
          readText: () => `\t10\n201\t\n203\t30`,
        },
      });

      combinedArray[0].materialNumber = '';
      combinedArray[1].quantity = 0;

      const combinedItem = {
        items: combinedArray,
      };
      await service.onPasteStart(false);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        pasteRowDataItemsToAddMaterial(combinedItem)
      );
    });
  });
});
