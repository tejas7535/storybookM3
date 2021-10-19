import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK } from '../../../../testing/mocks';
import { uploadSelectionToSap } from '../../../core/store';
import { UploadSelectionToSapButtonComponent } from './upload-selection-to-sap-button.component';

describe('uploadSelectionToSapButtonComponent', () => {
  let component: UploadSelectionToSapButtonComponent;
  let spectator: Spectator<UploadSelectionToSapButtonComponent>;
  let store: MockStore;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: UploadSelectionToSapButtonComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    params = {
      api: {
        getSelectedRows: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
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
  describe('uploadSelectionToSap', () => {
    test('should upload to SAP', () => {
      store.dispatch = jest.fn();
      component.selections = [{ gqPositionId: '1' }];
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          } as any)
      );
      component.uploadSelectionToSap();

      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenLastCalledWith(
        uploadSelectionToSap({ gqPositionIds: ['1'] })
      );
    });
  });
});
