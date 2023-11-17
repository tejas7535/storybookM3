import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { take } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationAttachment } from '@gq/shared/models';

import { SUPPORTED_FILE_TYPES } from './models/file-types.const';
import { FilesToUploadDisplay } from './models/files-to-upload-display.model';

@Component({
  selector: 'gq-attachment-files-upload-modal',
  templateUrl: './attachment-files-upload-modal.component.html',
})
export class AttachmentFilesUploadModalComponent {
  filesToUpload: FilesToUploadDisplay[] = [];

  disableUploadButton = false;
  private readonly MAX_FILE_SIZE = 2_000_000; // ~ 2MB

  constructor(
    public readonly activeCaseFacade: ActiveCaseFacade,
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      attachments: QuotationAttachment[];
    },
    private readonly dialogRef: MatDialogRef<AttachmentFilesUploadModalComponent>
  ) {}

  handleFileInput(event: Event) {
    event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;

    this.handleFileSelection(fileList);
  }

  handleDroppedFiles(files: FileList) {
    // Call the common function to handle dropped files
    this.handleFileSelection(files);
  }

  upload(): void {
    this.activeCaseFacade.uploadAttachments(
      this.filesToUpload
        .filter(
          (filesToFilter) =>
            !filesToFilter.exists && !filesToFilter.sizeExceeded
        )
        .map((file) => file.file)
    );

    this.activeCaseFacade.uploadAttachmentsSuccess$
      .pipe(take(1))
      .subscribe(() => {
        this.closeDialog();
      });
  }

  removeFile(file: FilesToUploadDisplay): void {
    this.filesToUpload.splice(this.filesToUpload.indexOf(file), 1);
    this.checkForDisabledUploadButton();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private handleFileSelection(fileList: FileList) {
    if (fileList) {
      const fileCount = fileList.length;
      for (let i = 0; i < fileCount; i = i + 1) {
        const file: FilesToUploadDisplay = {
          file: fileList.item(i),
          sizeExceeded: fileList.item(i).size > this.MAX_FILE_SIZE,
          exists: this.modalData.attachments?.some(
            (attachment) =>
              attachment.fileName.toLocaleLowerCase() ===
              fileList.item(i).name.toLocaleLowerCase()
          ),
          unsupportedFileType: !SUPPORTED_FILE_TYPES.some(
            (type) =>
              type.toLocaleLowerCase() ===
              this.getFileExtension(fileList.item(i).name)
          ),
        };
        if (file) {
          this.filesToUpload.push(file);
        }
      }
    }

    this.checkForDisabledUploadButton();
  }

  private checkForDisabledUploadButton(): void {
    this.disableUploadButton = this.filesToUpload.some(
      (file) => file.sizeExceeded || file.exists || file.unsupportedFileType
    );
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop().toLocaleLowerCase();
  }
}
