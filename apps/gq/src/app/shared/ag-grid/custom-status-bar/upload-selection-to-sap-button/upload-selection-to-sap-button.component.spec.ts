import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import * as statusbarUtils from '@gq/shared/ag-grid/custom-status-bar/statusbar.utils';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-community';
import { MockDirective } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK } from '../../../../../testing/mocks';
import { HideIfQuotationNotActiveDirective } from '../../../directives/hide-if-quotation-not-active/hide-if-quotation-not-active.directive';
import { UploadSelectionToSapButtonComponent } from './upload-selection-to-sap-button.component';
describe('uploadSelectionToSapButtonComponent', () => {
  let component: UploadSelectionToSapButtonComponent;
  let spectator: Spectator<UploadSelectionToSapButtonComponent>;
  let store: MockStore;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: UploadSelectionToSapButtonComponent,
    declarations: [MockDirective(HideIfQuotationNotActiveDirective)],
    imports: [
      MatDialogModule,
      PushPipe,
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    params = {
      api: {
        getSelectedRows: jest.fn(() => []),
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
      expect(component.simulationModeEnabled$).toBeDefined();
    });

    test(
      'should provide tooltipText$',
      marbles((m) => {
        jest
          .spyOn(statusbarUtils, 'getTooltipTextKeyByQuotationStatus')
          .mockReturnValue('anyFancyText');
        const statusPanelParams = {
          api: {
            addEventListener: jest.fn(),
          },
        } as any;

        component.agInit(statusPanelParams);
        m.expect(component.tooltipText$).toBeObservable(
          m.cold('a', { a: 'anyFancyText' })
        );
      })
    );
  });

  describe('ngOnDestroy', () => {
    test('should emit', () => {
      component['shutdown$$'].next = jest.fn();
      component['shutdown$$'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['shutdown$$'].next).toHaveBeenCalled();
      expect(component['shutdown$$'].unsubscribe).toHaveBeenCalled();
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
    test('should set selections and disable upload for empty array', () => {
      component['params'] = params;
      component.uploadDisabled = false;

      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component.uploadDisabled).toBeTruthy();
    });
    test('should set selections and disable upload for exceeding array max size', () => {
      component['params'] = params;
      component['params'].api.getSelectedRows = jest.fn().mockReturnValue(
        Array.from({
          length: component['QUOTATION_POSITION_UPLOAD_LIMIT'] + 1,
        })
      );
      component.uploadDisabled = false;

      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component.uploadDisabled).toBeTruthy();
    });
    test('should set selections and enable upload for array in range', () => {
      component['params'] = params;
      component['params'].api.getSelectedRows = jest.fn().mockReturnValue(
        Array.from({
          length: 5,
        })
      );
      component.uploadDisabled = true;

      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component.uploadDisabled).toBeFalsy();
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
      expect(component['dialog'].open).toHaveBeenCalledWith(
        ConfirmationModalComponent,
        {
          maxHeight: '80%',
          data: {
            displayText: 'translate it',
            confirmButton: 'TRANSLATE IT',
            cancelButton: 'TRANSLATE IT',
            icon: component.icon,
          },
        }
      );
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenLastCalledWith(
        ActiveCaseActions.uploadSelectionToSap({ gqPositionIds: ['1'] })
      );
    });
  });
});
