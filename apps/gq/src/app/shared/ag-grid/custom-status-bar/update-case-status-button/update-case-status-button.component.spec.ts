import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CASE_ORIGIN,
  ExtendedStatusPanelComponentParams,
  QuotationStatus,
} from '../../../models';
import { UpdateCaseStatusButtonComponent } from '../update-case-status-button/update-case-status-button.component';

describe('UpdateCaseStatusButtonComponent', () => {
  let component: UpdateCaseStatusButtonComponent;
  let spectator: Spectator<UpdateCaseStatusButtonComponent>;
  let params: IStatusPanelParams;
  let store: MockStore;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: UpdateCaseStatusButtonComponent,
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
    declarations: [UpdateCaseStatusButtonComponent],
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
      quotationStatus: QuotationStatus.ACTIVE,
      hasPanelCaption: true,
      isOnlyVisibleOnSelection: false,
      buttonColor: 'primary',
      buttonType: 'mat-any',
      showDialog: true,
      panelIcon: 'delete',
      classes: 'a-class',
      confirmDialogIcon: 'icon',
    } as unknown as ExtendedStatusPanelComponentParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit(params as unknown as ExtendedStatusPanelComponentParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(1);

      expect(component.isOnlyVisibleOnSelection).toEqual(false);
      expect(component.hasPanelCaption).toEqual(true);
      expect(component.panelCaption).toBeTruthy();
      expect(component.panelIcon).toEqual('delete');
      expect(component.showDialog).toEqual(true);
      expect(component.classes).toEqual('a-class');
      expect(component.buttonColor).toEqual('primary');
      expect(component.buttonType).toEqual('mat-any');
      expect(component).toBeDefined();
      expect(component.buttonColor).toBeDefined();
    });
    test('should set default values to params', () => {
      params = {
        ...params,
        isOnlyisOnlyVisibleOnSelection: undefined,
        hasPanelCaption: undefined,
        panelIcon: undefined,
        classes: undefined,
        buttonColor: undefined,
        buttonType: undefined,
        showDialog: undefined,
      } as unknown as ExtendedStatusPanelComponentParams;

      component.agInit(params as unknown as ExtendedStatusPanelComponentParams);

      expect(component['params']).toEqual(params);
      expect(component.isOnlyVisibleOnSelection).toEqual(false);
      expect(component.hasPanelCaption).toEqual(true);
      expect(component.showDialog).toEqual(false);
      expect(component.panelIcon).toEqual('');
      expect(component.classes).toEqual('');
      expect(component.buttonColor).toEqual('primary');
      expect(component.buttonType).toEqual('mat-stroked-button');
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component.agInit(params as unknown as ExtendedStatusPanelComponentParams);
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update the status with a confirmDialog', () => {
      store.dispatch = jest.fn();
      params = {
        ...params,
        showDialog: true,
      } as unknown as ExtendedStatusPanelComponentParams;

      component.agInit(params as unknown as ExtendedStatusPanelComponentParams);
      component.selections = [
        {
          customerName: 'customerName',
          gqId: 123,
          caseName: '',
          customerIdentifiers: { customerId: '', salesOrg: '' },
          gqCreated: '',
          gqCreatedByUser: undefined,
          gqLastUpdated: '',
          gqLastUpdatedByUser: undefined,
          sapCreated: '',
          sapCreatedByUser: undefined,
          sapId: '',
          origin: CASE_ORIGIN.CREATED_MANUALLY,
          status: QuotationStatus.ACTIVE,
        },
      ];

      component.updateStatus();

      expect(matDialogSpyObject.open).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should update the status without confirmDialog', () => {
      store.dispatch = jest.fn();
      params = {
        ...params,
        showDialog: false,
      } as unknown as ExtendedStatusPanelComponentParams;

      component.agInit(params as unknown as ExtendedStatusPanelComponentParams);
      component.selections = [
        {
          customerName: 'customerName',
          gqId: 123,
          caseName: '',
          customerIdentifiers: { customerId: '', salesOrg: '' },
          gqCreated: '',
          gqCreatedByUser: undefined,
          gqLastUpdated: '',
          gqLastUpdatedByUser: undefined,
          sapCreated: '',
          sapCreatedByUser: undefined,
          sapId: '',
          origin: CASE_ORIGIN.CREATED_MANUALLY,
          status: QuotationStatus.ACTIVE,
        },
      ];

      component.updateStatus();

      expect(matDialogSpyObject.open).not.toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
