import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import {
  addToRemoveMaterials,
  removeMaterials,
} from '../../../core/store/actions';
import { FlatButtonsComponent } from './flat-buttons.component';

describe('FlatButtonsComponent', () => {
  let component: FlatButtonsComponent;
  let spectator: Spectator<FlatButtonsComponent>;
  let params: IStatusPanelParams;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: FlatButtonsComponent,
    declarations: [FlatButtonsComponent],
    imports: [
      MatButtonModule,
      MatDialogModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            quotation: {
              item: QUOTATION_MOCK,
            },
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = ({
      api: {
        getSelectedRows: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const statusPanelParams = {
        api: {
          addEventListener: jest.fn(),
        },
      } as any;

      component.agInit(statusPanelParams);
      expect(component['params']).toBeDefined();
      expect(component['params'].api.addEventListener).toHaveBeenCalledTimes(2);
    });
  });
  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('showAddDialog', () => {
    test('should showAddDialog', () => {
      component['dialog'].open = jest.fn();

      component.showAddDialog();

      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
    });
  });
  describe('removeMaterials', () => {
    test('should call remove actions', () => {
      store.dispatch = jest.fn();

      component.selections = [QUOTATION_DETAIL_MOCK];
      component.removeMaterials();

      expect(store.dispatch).toHaveBeenCalledWith(
        addToRemoveMaterials({
          gqPositionIds: [QUOTATION_DETAIL_MOCK.gqPositionId],
        })
      );
      expect(store.dispatch).toHaveBeenCalledWith(removeMaterials());
    });
  });
});
