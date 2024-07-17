import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import * as statusbarUtils from '@gq/shared/ag-grid/custom-status-bar/statusbar.utils';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { HideIfQuotationNotActiveOrPendingDirective } from '@gq/shared/directives/hide-if-quotation-not-active-or-pending/hide-if-quotation-not-active-or-pending.directive';
import { QuotationStatus, SAP_SYNC_STATUS } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-community';
import { MockDirective, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK } from '../../../../../testing/mocks';
import { UploadSelectionToSapButtonComponent } from './upload-selection-to-sap-button.component';
describe('uploadSelectionToSapButtonComponent', () => {
  let component: UploadSelectionToSapButtonComponent;
  let spectator: Spectator<UploadSelectionToSapButtonComponent>;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: UploadSelectionToSapButtonComponent,
    declarations: [MockDirective(HideIfQuotationNotActiveOrPendingDirective)],
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
      MockProvider(ActiveCaseFacade, {
        canEditQuotation$: of(true),
        isQuotationStatusActive$: of(true),
        simulationModeEnabled$: of(true),
        quotationSapId$: of('sap123'),
        quotationSapSyncStatus$: of(SAP_SYNC_STATUS.SYNCED),
        quotationStatus$: of(QuotationStatus.ACTIVE),
        uploadSelectionToSap: jest.fn(),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    params = {
      api: {
        getSelectedRows: jest.fn(() => []),
      },
    } as unknown as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should provide Observables', () => {
    test(
      'should provide sapId$',
      marbles((m) => {
        m.expect(component.sapId$).toBeObservable(
          m.cold('(a|)', { a: 'sap123' })
        );
      })
    );
    test(
      'should provide simulationModeEnabled$',
      marbles((m) => {
        m.expect(component.simulationModeEnabled$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
      })
    );
    test(
      'should provide quotationActive$',
      marbles((m) => {
        m.expect(component.quotationActive$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
      })
    );
    test(
      'should provide quotationEditable$',
      marbles((m) => {
        m.expect(component.quotationEditable$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
      })
    );
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
          m.cold('(a|)', { a: 'anyFancyText' })
        );
      })
    );
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
      component.selections = [{ gqPositionId: '1' }];
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          }) as any
      );
      component.uploadSelectionToSap();

      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(component['dialog'].open).toHaveBeenCalledWith(
        ConfirmationModalComponent,
        {
          maxHeight: '80%',
          data: {
            title: 'translate it',
            confirmButtonText: 'TRANSLATE IT',
            cancelButtonText: 'TRANSLATE IT',
            confirmButtonIcon: component.icon,
          },
        }
      );
      expect(
        component['activeCaseFacade'].uploadSelectionToSap
      ).toHaveBeenCalledTimes(1);
    });
  });
});
