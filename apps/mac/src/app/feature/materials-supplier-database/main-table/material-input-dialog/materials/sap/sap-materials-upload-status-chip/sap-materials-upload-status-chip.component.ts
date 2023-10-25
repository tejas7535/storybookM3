import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SapMaterialsUploadStatus } from './sap-materials-upload-status.enum';

interface ChipConfig {
  icon: string;
  color: string;
  textColor: string;
  backgroundColor: string;
}

@Component({
  selector: 'mac-sap-materials-upload-status-chip',
  templateUrl: './sap-materials-upload-status-chip.component.html',
})
export class SapMaterialsUploadStatusChipComponent {
  @Input() fileName: string;

  @Output() removed = new EventEmitter<void>();

  config: ChipConfig;

  private readonly UPLOAD_STATUS_TO_CHIP_CONFIG: {
    [status: number]: ChipConfig;
  } = {
    [SapMaterialsUploadStatus.IN_PROGRESS]: {
      icon: 'cloud_upload',
      color: '#1C98B5',
      textColor: '#00596E',
      backgroundColor: '#F0F6FA',
    },
    [SapMaterialsUploadStatus.SUCCEED]: {
      icon: 'check_circle_outline',
      color: '#A1C861',
      textColor: '#3C7029',
      backgroundColor: '#F8FBF4',
    },
    [SapMaterialsUploadStatus.FAILED]: {
      icon: 'warning_outline',
      color: '#CB0B15',
      textColor: '#A30F0C',
      backgroundColor: '#FCEEE8',
    },
  };

  @Input()
  set status(status: SapMaterialsUploadStatus) {
    this.config = this.UPLOAD_STATUS_TO_CHIP_CONFIG[status];
  }

  remove(): void {
    this.removed.emit();
  }
}
