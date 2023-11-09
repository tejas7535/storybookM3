import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { filter, Subject, take, takeUntil } from 'rxjs';

import { SapMaterialsDatabaseUploadStatus } from '@mac/feature/materials-supplier-database/models';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import {
  sapMaterialsUploadStatusDialogMinimized,
  sapMaterialsUploadStatusDialogOpened,
  sapMaterialsUploadStatusReset,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

interface UploadStatusDialogConfig {
  minimizeEnabled: boolean;
  closeEnabled: boolean;
  status: {
    color: string;
    icon: string;
    animationClass?: string;
    descriptionTranslationKeySuffix: string;
  };
  infoTranslationKeySuffix?: string;
  warningTranslationKeySuffix?: string;
  cancelButtonTranslationKeySuffix?: string;
  confirmButtonTranslationKeySuffix: string;
  minimize?: () => void;
  cancel?: () => void;
  confirm: () => void;
}

@Component({
  selector: 'mac-sap-materials-upload-status-dialog',
  templateUrl: './sap-materials-upload-status-dialog.component.html',
  styleUrls: ['./sap-materials-upload-status-dialog.component.scss'],
})
export class SapMaterialsUploadStatusDialogComponent
  implements OnInit, OnDestroy
{
  config: UploadStatusDialogConfig;

  private readonly DATABASE_UPLOAD_STATUS_TO_DIALOG_CONFIG: {
    [status: string]: UploadStatusDialogConfig;
  } = {
    [SapMaterialsDatabaseUploadStatus.RUNNING]: {
      minimizeEnabled: true,
      closeEnabled: false,
      status: {
        color: '#00893D',
        icon: 'cloud_upload',
        animationClass: 'pulse-animation',
        descriptionTranslationKeySuffix:
          SapMaterialsDatabaseUploadStatus.RUNNING,
      },
      infoTranslationKeySuffix: 'minimizeInfo',
      warningTranslationKeySuffix: 'browserTabWarning',
      confirmButtonTranslationKeySuffix: 'minimize',
      minimize: () => this.minimize(),
      confirm: () => this.minimize(),
    },
    [SapMaterialsDatabaseUploadStatus.DONE]: {
      minimizeEnabled: false,
      closeEnabled: true,
      status: {
        color: '#00893D',
        icon: 'check_circle_outline',
        descriptionTranslationKeySuffix: SapMaterialsDatabaseUploadStatus.DONE,
      },
      confirmButtonTranslationKeySuffix: 'close',
      cancel: () => this.close(),
      confirm: () => this.close(),
    },
    [SapMaterialsDatabaseUploadStatus.FAILED]: {
      minimizeEnabled: false,
      closeEnabled: true,
      status: {
        color: '#CB0B15',
        icon: 'error_outline',
        descriptionTranslationKeySuffix:
          SapMaterialsDatabaseUploadStatus.FAILED,
      },
      cancelButtonTranslationKeySuffix: 'close',
      confirmButtonTranslationKeySuffix: 'startNew',
      cancel: () => this.close(),
      confirm: () => this.startNewUpload(),
    },
  };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<SapMaterialsUploadStatusDialogComponent>,
    private readonly dialogFacade: DialogFacade,
    private readonly dialogService: MsdDialogService
  ) {}

  ngOnInit(): void {
    this.dialogFacade.dispatch(sapMaterialsUploadStatusDialogOpened());
    this.handleUploadStatusChanges();
    this.handleGetUploadStatusFailure();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleUploadStatusChanges(): void {
    this.dialogFacade.sapMaterialsDatabaseUploadStatus$
      .pipe(
        filter(
          (databaseUploadStatus: SapMaterialsDatabaseUploadStatus) =>
            !!databaseUploadStatus
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (databaseUploadStatus: SapMaterialsDatabaseUploadStatus) =>
          (this.config =
            this.DATABASE_UPLOAD_STATUS_TO_DIALOG_CONFIG[databaseUploadStatus])
      );
  }

  private handleGetUploadStatusFailure(): void {
    this.dialogFacade.getSapMaterialsDatabaseUploadStatusFailed$
      .pipe(take(1))
      .subscribe(() => this.close());
  }

  private minimize(): void {
    this.dialogRef.close();
    this.dialogFacade.dispatch(sapMaterialsUploadStatusDialogMinimized());
  }

  private close(): void {
    this.dialogRef.close();
    this.dialogFacade.dispatch(sapMaterialsUploadStatusReset());
  }

  private startNewUpload(): void {
    this.close();
    // Delay opening the upload dialog in order to prevent ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.dialogService.openSapMaterialsUploadDialog(), 120);
  }
}
