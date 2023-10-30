/* tslint:disable:no-unused-variable */
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import * as statusbarUtils from '@gq/shared/ag-grid/custom-status-bar/statusbar.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-community';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { UpdateCaseStatusButtonComponent } from '../update-case-status-button/update-case-status-button.component';
import { UploadQuoteToSapButtonComponent } from './upload-quote-to-sap-button.component';
describe('UploadQuoteToSapButtonComponent', () => {
  let component: UploadQuoteToSapButtonComponent;
  let spectator: Spectator<UploadQuoteToSapButtonComponent>;
  let params: IStatusPanelParams;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: UploadQuoteToSapButtonComponent,
    imports: [
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
      MatDialogModule,
      MatIconModule,
      MatTooltipModule,
      PushModule,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [UpdateCaseStatusButtonComponent],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    params = {
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(() => [{ QUOTATION_DETAIL_MOCK }]),
      },
    } as unknown as IStatusPanelParams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store).toBeDefined();
  });

  describe('agInit', () => {
    test('should set params and listeners', () => {
      component.agInit(params as unknown as IStatusPanelParams);
      expect(component['params']).toEqual(params);
      expect(params.api.addEventListener).toHaveBeenCalledTimes(1);
    });

    test(
      'should provide tooltipText$',
      marbles((m) => {
        jest
          .spyOn(statusbarUtils, 'getTooltipTextKeyByQuotationStatus')
          .mockReturnValue('anyFancyText');
        component.agInit(params as unknown as IStatusPanelParams);
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

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component.agInit(params as unknown as IStatusPanelParams);

      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
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
  });

  describe('Upload Case to SAP', () => {
    it('should dispatch action', () => {
      store.dispatch = jest.fn();
      component.agInit(params as unknown as IStatusPanelParams);
      component.selections = [{ ...QUOTATION_DETAIL_MOCK }];
      component.uploadCaseToSap();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
