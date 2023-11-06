import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { SapMaterialsDatabaseUploadStatus } from '@mac/feature/materials-supplier-database/models';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import {
  sapMaterialsUploadStatusDialogMinimized,
  sapMaterialsUploadStatusDialogOpened,
  sapMaterialsUploadStatusReset,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import { SapMaterialsUploadStatusDialogComponent } from './sap-materials-upload-status-dialog.component';

describe('SapMaterialsUploadStatusDialogComponent', () => {
  let component: SapMaterialsUploadStatusDialogComponent;
  let spectator: Spectator<SapMaterialsUploadStatusDialogComponent>;

  const createComponent = createComponentFactory({
    component: SapMaterialsUploadStatusDialogComponent,
    declarations: [SapMaterialsUploadStatusDialogComponent],
    providers: [
      { provide: MatDialogRef, useValue: { close: jest.fn() } },
      mockProvider(DialogFacade, {
        dispatch: jest.fn(),
      }),
      mockProvider(MsdDialogService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    jest.resetAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should dispatch sapMaterialsUploadStatusDialogOpened action', () => {
      component['handleUploadStatusChanges'] = jest.fn();
      component['handleGetUploadStatusFailure'] = jest.fn();

      component.ngOnInit();

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        sapMaterialsUploadStatusDialogOpened()
      );
    });

    test('should set config on database upload status change', () => {
      const status = SapMaterialsDatabaseUploadStatus.DONE;

      component['handleGetUploadStatusFailure'] = jest.fn();
      component.config = undefined;
      component['dialogFacade'].sapMaterialsDatabaseUploadStatus$ = of(status);

      component.ngOnInit();

      expect(component.config).toBe(
        component['DATABASE_UPLOAD_STATUS_TO_DIALOG_CONFIG'][status]
      );
    });

    test('should not set config on database upload status change if status is undefined', () => {
      const config = {} as any;

      component['handleGetUploadStatusFailure'] = jest.fn();
      component.config = config;
      component['dialogFacade'].sapMaterialsDatabaseUploadStatus$ = of(
        undefined as any
      );

      component.ngOnInit();

      expect(component.config).toBe(config);
    });

    test('should close dialog on getUploadStatusFailure', () => {
      component['handleUploadStatusChanges'] = jest.fn();
      component['close'] = jest.fn();
      component['dialogFacade'].getSapMaterialsDatabaseUploadStatusFailed$ = of(
        true as any
      );

      component.ngOnInit();

      expect(component['close']).toHaveBeenCalledTimes(1);
    });
  });

  test('should emit on destroy', () => {
    component['destroy$'].next = jest.fn();
    component['destroy$'].complete = jest.fn();

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  describe('minimize', () => {
    test('should close dialog and dispatch sapMaterialsUploadStatusDialogMinimized', () => {
      component['minimize']();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        sapMaterialsUploadStatusDialogMinimized()
      );
    });
  });

  describe('close', () => {
    test('should close dialog and dispatch sapMaterialsUploadStatusReset', () => {
      component['close']();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        sapMaterialsUploadStatusReset()
      );
    });
  });

  describe('startUpload', () => {
    test('should close dialog and open SapMaterialsUploadDialog', () => {
      jest.useFakeTimers();
      jest.spyOn(window, 'setTimeout');

      component['dialogService'].openSapMaterialsUploadDialog = jest.fn();

      component['startNewUpload']();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(130);
      expect(
        component['dialogService'].openSapMaterialsUploadDialog
      ).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });
});
