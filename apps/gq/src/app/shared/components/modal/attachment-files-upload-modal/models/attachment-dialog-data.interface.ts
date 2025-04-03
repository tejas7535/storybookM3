import { Observable } from 'rxjs';

export interface AttachmentDialogData {
  dialogTitle?: string;
  dialogSubtitle?: string;
  uploadButtonCaption?: string;
  fileNames: string[];
  upload: (files: File[]) => void;
  uploading$: Observable<boolean>;
  uploadSuccess$: Observable<void>;
  showWarning?: boolean;
  warningMessage?: string;
}
