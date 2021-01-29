import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  pasteRowDataItems,
  pasteRowDataItemsToAddMaterial,
} from '../../../core/store';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../core/store/models';
import { CellRendererModule } from '../../cell-renderer/cell-renderer.module';
import { AddMaterialButtonComponent } from '../../custom-status-bar/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '../../custom-status-bar/create-case-button/create-case-button.component';
import { CustomStatusBarModule } from '../../custom-status-bar/custom-status-bar.module';
import { ResetAllButtonComponent } from '../../custom-status-bar/reset-all-button/reset-all-button.component';
import { InputTableComponent } from './input-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('InputTableComponent', () => {
  let component: InputTableComponent;
  let spectator: Spectator<InputTableComponent>;
  let mockStore: MockStore;
  let currentCell: MaterialTableItem;
  let combinedArray: MaterialTableItem[];

  const createComponent = createComponentFactory({
    component: InputTableComponent,
    imports: [
      AgGridModule.withComponents([
        AddMaterialButtonComponent,
        CreateCaseButtonComponent,
        ResetAllButtonComponent,
      ]),
      CellRendererModule,
      CustomStatusBarModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      provideMockStore({}),
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = TestBed.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onPasteStart', () => {
    beforeEach(() => {
      mockStore.dispatch = jest.fn();
      currentCell = { materialNumber: '10', quantity: 5 };
      component['currentCell'] = currentCell;

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
        pasteDestination: currentCell,
      };
      await component.onPasteStart();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        pasteRowDataItemsToAddMaterial(combinedItem)
      );
      expect(component['currentCell']).toBeUndefined();
    });

    test('should dispatch action with transformed array', async () => {
      Object.assign(navigator, {
        clipboard: {
          readText: () => `\t10\n201\t\n203\t30`,
        },
      });

      combinedArray[0].materialNumber = '';
      combinedArray[1].quantity = 0;

      const combinedItem = {
        items: combinedArray,
        pasteDestination: currentCell,
      };
      await component.onPasteStart();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        pasteRowDataItemsToAddMaterial(combinedItem)
      );
      expect(component['currentCell']).toBeUndefined();
    });

    test('should dispatch action with transformed array', async () => {
      // Test case of last line being empty
      Object.assign(navigator, {
        clipboard: {
          readText: () => `20\t10\n201\t20\n203\t30\n`,
        },
      });

      const combinedItem = {
        items: combinedArray,
        pasteDestination: currentCell,
      };
      InputTableComponent.prototype['isCaseView'] = true;
      await component.onPasteStart();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        pasteRowDataItems(combinedItem)
      );
      expect(component['currentCell']).toBeUndefined();
    });
  });
  describe('onCellClicked', () => {
    test('should set currentCell', () => {
      const params = {
        data: { materialNumber: '20', quantity: 10 },
      } as any;
      component.onCellClicked(params);
      expect(component['currentCell']).toEqual(params.data);
    });
  });
});
