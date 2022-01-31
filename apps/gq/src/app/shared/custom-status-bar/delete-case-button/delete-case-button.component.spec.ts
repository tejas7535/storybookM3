import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DeleteCaseButtonComponent } from './delete-case-button.component';

describe('DeleteCaseButtonComponent', () => {
  let component: DeleteCaseButtonComponent;
  let spectator: Spectator<DeleteCaseButtonComponent>;
  let params: IStatusPanelParams;
  let store: MockStore;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: DeleteCaseButtonComponent,
    imports: [
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
      MatDialogModule,
      MatIconModule,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [DeleteCaseButtonComponent],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    matDialogSpyObject = spectator.inject(MatDialog);
    matDialogSpyObject.open.andReturn({
      afterClosed: jest.fn(() => of(true)),
    });
    params = {
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit(params as unknown as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(1);
    });
  });
  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });
  describe('deleteCase', () => {
    test('should open dialog', () => {
      store.dispatch = jest.fn();

      component.selections = [{ customerName: 'customerName', gqId: '123' }];
      component.deleteCase();

      expect(matDialogSpyObject.open).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
