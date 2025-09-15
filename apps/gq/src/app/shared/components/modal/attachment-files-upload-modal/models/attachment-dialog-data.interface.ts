import { Signal, TemplateRef } from '@angular/core';

import { Observable } from 'rxjs';

export interface AttachmentDialogData {
  dialogTitle?: string;
  dialogSubtitle?: string;
  uploadButtonCaption?: string;
  fileNames: Signal<string[]>;

  upload: (files: File[]) => void;
  uploading$: Observable<boolean>;
  uploadSuccess$: Observable<void>;
  showWarning?: boolean;
  warningMessage?: string;
  /**
   * a template reference that will be displayed under the file upload area
   */
  templateRef?: TemplateRef<any>;
  additionalDisableUploadButtonCondition?: Observable<boolean>;
}
