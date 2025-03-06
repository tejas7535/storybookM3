import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { getUsername } from '@schaeffler/azure-auth';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  getBomExportFeatureStatus,
  resetBomExportStatusTracking,
  trackBomExportStatus,
} from '@cdba/core/store';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import {
  BomExportProgress,
  BomExportStatus,
} from '@cdba/user-interaction/model/feature/bom-export';

import { LocalizedOffsetDatetimePipe } from '../../shared/pipes/localized-offset-datetime/localized-offset-datetime.pipe';
import { BOM_EXPORT_RUNNING } from '../model/feature/bom-export/bom-export-status-enum.model';

@Component({
  templateUrl: './user-interaction-dialog.component.html',
  styleUrls: ['./user-interaction-dialog.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatProgressBarModule,
    SharedTranslocoModule,
    PushPipe,
    UndefinedAttributeFallbackModule,
    LocalizedOffsetDatetimePipe,
  ],
})
export class UserInteractionDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(
    MatDialogRef<UserInteractionDialogComponent>
  );
  private bomExportStatusSubscription: Subscription;
  private readonly bomExportStatus$ = this.store.select(
    getBomExportFeatureStatus
  );

  username$ = this.store.select(getUsername);

  status: BomExportStatus;
  userFriendlyProgress: string;
  progressBarValue = 0;
  refreshStatusBtnDisabled = true;
  downloadBtnTooltip: string;

  constructor(
    private readonly store: Store,
    private readonly transloco: TranslocoService
  ) {}

  onDownload(): void {
    if (this.status?.downloadUrl) {
      window.open(this.status.downloadUrl, '_blank');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Manually refresh progress tracking in case of a tracking error
   */
  refreshProgress(): void {
    this.store.dispatch(resetBomExportStatusTracking());
    this.store.dispatch(trackBomExportStatus());
  }

  ngOnInit(): void {
    this.userFriendlyProgress = this.transloco.translate(
      'userInteraction.dialog.progress.waiting'
    );

    this.bomExportStatusSubscription = this.bomExportStatus$.subscribe(
      (status: BomExportStatus) => {
        this.status = status;
        this.updateProgress(status);
        this.updateTranslations(status);
        if (status?.progress === BomExportProgress.FAILED) {
          this.refreshStatusBtnDisabled = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.bomExportStatusSubscription) {
      this.bomExportStatusSubscription.unsubscribe();
    }
  }

  isDownloadBtnDisabled() {
    return (
      this.status?.progress !== BomExportProgress.FINISHED ||
      new Date(this.status?.downloadUrlExpiry) < new Date()
    );
  }

  private updateTranslations(status: BomExportStatus) {
    if (BOM_EXPORT_RUNNING.includes(status?.progress)) {
      this.userFriendlyProgress = this.transloco.translate(
        'userInteraction.dialog.progress.inProgress'
      );
    } else if (status?.progress === BomExportProgress.FAILED) {
      this.userFriendlyProgress = this.transloco.translate(
        'userInteraction.dialog.progress.failed'
      );
      this.downloadBtnTooltip = this.transloco.translate(
        'userInteraction.dialog.tooltip.exportFailed'
      );
    } else if (status?.progress === BomExportProgress.FINISHED) {
      this.userFriendlyProgress = this.transloco.translate(
        'userInteraction.dialog.progress.finished'
      );
      if (new Date(status?.downloadUrlExpiry) < new Date()) {
        this.downloadBtnTooltip = this.transloco.translate(
          'userInteraction.dialog.tooltip.downloadExpired'
        );
      }
    }
  }

  private updateProgress(status: BomExportStatus) {
    switch (status?.progress) {
      case BomExportProgress.STARTED: {
        this.progressBarValue = 0;
        break;
      }
      case BomExportProgress.IN_PROGRESS_1: {
        this.progressBarValue = 10;
        break;
      }
      case BomExportProgress.IN_PROGRESS_2: {
        this.progressBarValue = 20;
        break;
      }
      case BomExportProgress.IN_PROGRESS_3: {
        this.progressBarValue = 30;
        break;
      }
      case BomExportProgress.IN_PROGRESS_4: {
        this.progressBarValue = 40;
        break;
      }
      case BomExportProgress.IN_PROGRESS_5: {
        this.progressBarValue = 50;
        break;
      }
      case BomExportProgress.IN_PROGRESS_6: {
        this.progressBarValue = 60;
        break;
      }
      case BomExportProgress.IN_PROGRESS_7: {
        this.progressBarValue = 80;
        break;
      }
      case BomExportProgress.IN_PROGRESS_8: {
        this.progressBarValue = 90;
        break;
      }
      case BomExportProgress.FINISHED: {
        this.progressBarValue = 100;
        break;
      }
      case BomExportProgress.FAILED: {
        this.progressBarValue = 100;
        break;
      }

      default: {
        break;
      }
    }
  }
}
