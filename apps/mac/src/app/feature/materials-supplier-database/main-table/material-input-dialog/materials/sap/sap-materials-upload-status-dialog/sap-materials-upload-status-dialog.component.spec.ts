import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { SapMaterialsDatabaseUploadStatus } from '@mac/feature/materials-supplier-database/models';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import { SapMaterialsUploadStatusDialogComponent } from './sap-materials-upload-status-dialog.component';

describe('SapMaterialsUploadStatusDialogComponent', () => {
  let component: SapMaterialsUploadStatusDialogComponent;
  let spectator: Spectator<SapMaterialsUploadStatusDialogComponent>;
  let dialogFacade: DialogFacade;

  const createComponent = createComponentFactory({
    component: SapMaterialsUploadStatusDialogComponent,
    providers: [
      { provide: MatDialogRef, useValue: { close: jest.fn() } },
      mockProvider(DialogFacade, {
        clearRejectedSapMaterials: jest.fn(),
        downloadRejectedSapMaterials: jest.fn(),
        sapMaterialsUploadStatusReset: jest.fn(),
      }),
      mockProvider(MsdDialogService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    dialogFacade = spectator.inject(DialogFacade);
    jest.resetAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set config on database upload status change', () => {
      const dbStatus = { status: SapMaterialsDatabaseUploadStatus.DONE };

      component['handleGetUploadStatusFailure'] = jest.fn();
      component.config = undefined;
      component.currentDatabaseUploadStatus = undefined;
      component['dialogFacade'].sapMaterialsDatabaseUploadStatus$ =
        of(dbStatus);

      component.ngOnInit();

      expect(component.config).toBe(
        component['DATABASE_UPLOAD_STATUS_TO_DIALOG_CONFIG'][dbStatus.status]
      );
      expect(component.currentDatabaseUploadStatus).toBe(dbStatus);
    });

    test('should not set config on database upload status change if status is undefined', () => {
      component['handleGetUploadStatusFailure'] = jest.fn();
      component['dialogFacade'].sapMaterialsDatabaseUploadStatus$ = of(
        undefined as any
      );

      component.ngOnInit();

      expect(component.config).toBe(
        component['DATABASE_UPLOAD_STATUS_TO_DIALOG_CONFIG'][
          SapMaterialsDatabaseUploadStatus.RUNNING
        ]
      );
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

  describe('close', () => {
    test('should close dialog and dispatch sapMaterialsUploadStatusReset', () => {
      component['close']();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(dialogFacade.sapMaterialsUploadStatusReset).toHaveBeenCalled();
      expect(dialogFacade.clearRejectedSapMaterials).toHaveBeenCalled();
    });
  });

  describe('downloadRejected', () => {
    test('should dispatch downloadRejectedSapMaterials', () => {
      component['downloadRejected']();

      expect(dialogFacade.downloadRejectedSapMaterials).toHaveBeenCalled();
    });
  });

  describe('shouldShowDownloadRejected', () => {
    test('should return true if rejectedCount > 0', () => {
      component.currentDatabaseUploadStatus = {
        rejectedCount: 10,
        status: SapMaterialsDatabaseUploadStatus.DONE,
      };

      expect(component['shouldShowDownloadRejected']()).toBe(true);
    });

    test('should return false if rejectedCount = 0', () => {
      component.currentDatabaseUploadStatus = {
        rejectedCount: 0,
        status: SapMaterialsDatabaseUploadStatus.DONE,
      };

      expect(component['shouldShowDownloadRejected']()).toBe(false);
    });

    test('should return false if rejectedCount is undefined', () => {
      component.currentDatabaseUploadStatus = {
        rejectedCount: undefined,
        status: SapMaterialsDatabaseUploadStatus.RUNNING,
      };

      expect(component['shouldShowDownloadRejected']()).toBe(false);
    });
  });

  describe('sendSupportEmail', () => {
    test('should open mailto link', () => {
      const openSpy = jest
        .spyOn(window, 'open')
        .mockImplementation(() => window);

      component['sendSupportEmail']();

      expect(openSpy).toHaveBeenCalledWith(
        `mailto:${component['SUPPORT_EMAIL']}`
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
