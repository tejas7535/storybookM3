import { TestBed } from '@angular/core/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { pasteRowDataItems } from '../../../core/store';
import { ValidationDescription } from '../../../core/store/models';
import { CreateCaseButtonComponent } from '../../../shared/custom-status-bar/create-case-button/create-case-button.component';
import { CustomStatusBarModule } from '../../../shared/custom-status-bar/custom-status-bar.module';
import { ResetAllButtonComponent } from '../../../shared/custom-status-bar/reset-all-button/reset-all-button.component';
import { CellRendererModule } from './cell-renderer/cell-renderer.module';
import { InputTableComponent } from './input-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('InputTableComponent', () => {
  let component: InputTableComponent;
  let spectator: Spectator<InputTableComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: InputTableComponent,
    imports: [
      AgGridModule.withComponents([
        CreateCaseButtonComponent,
        ResetAllButtonComponent,
      ]),
      CellRendererModule,
      CustomStatusBarModule,
    ],
    providers: [provideMockStore({})],
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
    test('should dispatch action with transformed array', async () => {
      Object.assign(navigator, {
        clipboard: {
          readText: () => `20\t10\n201\t20\n203\t30`,
        },
      });
      mockStore.dispatch = jest.fn();
      const currentCell = { materialNumber: '10', quantity: '5' };
      component['currentCell'] = currentCell;

      const combinedArray = [
        {
          materialNumber: '20',
          quantity: '10',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '201',
          quantity: '20',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '203',
          quantity: '30',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];
      const combinedItem = {
        items: combinedArray,
        pasteDestination: currentCell,
      };
      await component.onPasteStart();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        pasteRowDataItems(combinedItem)
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
      mockStore.dispatch = jest.fn();
      const currentCell = { materialNumber: '10', quantity: '5' };
      component['currentCell'] = currentCell;

      const combinedArray = [
        {
          materialNumber: '20',
          quantity: '10',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '201',
          quantity: '20',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '203',
          quantity: '30',
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];
      const combinedItem = {
        items: combinedArray,
        pasteDestination: currentCell,
      };
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
        data: { materialNumber: '20', quantity: '10' },
      } as any;
      component.onCellClicked(params);
      expect(component['currentCell']).toEqual(params.data);
    });
  });
});
