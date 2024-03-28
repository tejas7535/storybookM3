import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { filter, Subject, take, takeUntil } from 'rxjs';

import {
  SapMaterialsDatabaseUploadStatus,
  SapMaterialsDatabaseUploadStatusResponse,
} from '@mac/feature/materials-supplier-database/models';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

interface UploadStatusDialogConfig {
  closeEnabled: boolean;
  status: {
    color: string;
    icon: string;
    animationClass?: string;
    descriptionTranslationKeySuffix: string;
  };
  statusAction?: {
    infos: {
      translationKeySuffix: string;
      shouldShow: () => boolean;
    }[];
    button: {
      translationKeySuffix: string;
      icon: string;
      action: () => void;
      shouldShow: () => boolean;
    };
  };
  infoTranslationKeySuffix?: string;
  warningTranslationKeySuffix?: string;
  cancelButtonTranslationKeySuffix?: string;
  confirmButtonTranslationKeySuffix?: string;
  cancel?: () => void;
  confirm?: () => void;
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
  currentDatabaseUploadStatus: SapMaterialsDatabaseUploadStatusResponse;

  private readonly DATABASE_UPLOAD_STATUS_TO_DIALOG_CONFIG: {
    [status: string]: UploadStatusDialogConfig;
  } = {
    [SapMaterialsDatabaseUploadStatus.RUNNING]: {
      closeEnabled: false,
      status: {
        color: '#00893D',
        icon: 'cloud_upload',
        animationClass: 'pulse-animation',
        descriptionTranslationKeySuffix:
          SapMaterialsDatabaseUploadStatus.RUNNING,
      },
      warningTranslationKeySuffix: 'browserTabWarning',
    },
    [SapMaterialsDatabaseUploadStatus.DONE]: {
      closeEnabled: true,
      status: {
        color: '#00893D',
        icon: 'check_circle_outline',
        descriptionTranslationKeySuffix: SapMaterialsDatabaseUploadStatus.DONE,
      },
      statusAction: {
        infos: [
          {
            translationKeySuffix: `${SapMaterialsDatabaseUploadStatus.DONE}_1`,
            shouldShow: () => true,
          },
          {
            translationKeySuffix: `${SapMaterialsDatabaseUploadStatus.DONE}_2`,
            shouldShow: () => true,
          },
          {
            translationKeySuffix: `${SapMaterialsDatabaseUploadStatus.DONE}_3`,
            shouldShow: () => this.shouldShowDownloadRejected(),
          },
        ],
        button: {
          translationKeySuffix: 'downloadRejected',
          icon: 'download_outlined',
          action: () => this.downloadRejected(),
          shouldShow: () => this.shouldShowDownloadRejected(),
        },
      },
      confirmButtonTranslationKeySuffix: 'close',
      cancel: () => this.close(),
      confirm: () => this.close(),
    },
    [SapMaterialsDatabaseUploadStatus.FAILED]: {
      closeEnabled: true,
      status: {
        color: '#CB0B15',
        icon: 'error_outline',
        descriptionTranslationKeySuffix:
          SapMaterialsDatabaseUploadStatus.FAILED,
      },
      statusAction: {
        infos: [
          {
            translationKeySuffix: `${SapMaterialsDatabaseUploadStatus.FAILED}_1`,
            shouldShow: () => true,
          },
          {
            translationKeySuffix: `${SapMaterialsDatabaseUploadStatus.FAILED}_2`,
            shouldShow: () => true,
          },
          {
            translationKeySuffix: `${SapMaterialsDatabaseUploadStatus.FAILED}_3`,
            shouldShow: () => true,
          },
        ],
        button: {
          translationKeySuffix: 'sendSupportEmail',
          icon: 'mail_outlined',
          action: () => this.sendSupportEmail(),
          shouldShow: () => true,
        },
      },
      cancelButtonTranslationKeySuffix: 'close',
      confirmButtonTranslationKeySuffix: 'startNew',
      cancel: () => this.close(),
      confirm: () => this.startNewUpload(),
    },
  };

  private readonly SUPPORT_EMAIL = 'or-hza-msd-notification@schaeffler.com';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<SapMaterialsUploadStatusDialogComponent>,
    private readonly dialogFacade: DialogFacade,
    private readonly dialogService: MsdDialogService
  ) {}

  ngOnInit(): void {
    this.config =
      this.DATABASE_UPLOAD_STATUS_TO_DIALOG_CONFIG[
        SapMaterialsDatabaseUploadStatus.RUNNING
      ];

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
          (databaseUploadStatus: SapMaterialsDatabaseUploadStatusResponse) =>
            !!databaseUploadStatus
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (databaseUploadStatus: SapMaterialsDatabaseUploadStatusResponse) => {
          if (databaseUploadStatus) {
            this.currentDatabaseUploadStatus = databaseUploadStatus;
            this.config =
              this.DATABASE_UPLOAD_STATUS_TO_DIALOG_CONFIG[
                databaseUploadStatus.status
              ];
          }
        }
      );
  }

  private handleGetUploadStatusFailure(): void {
    this.dialogFacade.getSapMaterialsDatabaseUploadStatusFailed$
      .pipe(take(1))
      .subscribe(() => this.close());
  }

  private close(): void {
    this.dialogFacade.clearRejectedSapMaterials();
    this.dialogRef.close();
    this.dialogFacade.sapMaterialsUploadStatusReset();
  }

  private startNewUpload(): void {
    this.close();
    // Delay opening the upload dialog in order to prevent ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.dialogService.openSapMaterialsUploadDialog(), 120);
  }

  private shouldShowDownloadRejected(): boolean {
    return this.currentDatabaseUploadStatus?.rejectedCount > 0;
  }

  private sendSupportEmail(): void {
    window.open(`mailto:${this.SUPPORT_EMAIL}`);
  }

  private downloadRejected(): void {
    this.dialogFacade.downloadRejectedSapMaterials();
  }
}
