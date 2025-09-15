import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Observable, of, take } from 'rxjs';

import { InfoBannerComponent } from '@gq/shared/components/info-banner/info-banner.component';
import { DragAndDropDirective } from '@gq/shared/directives/drag-and-drop/drag-and-drop-directive';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { AttachmentDialogData } from './models/attachment-dialog-data.interface';
import { UNSUPPORTED_FILE_TYPES } from './models/file-types.const';
import { FilesToUploadDisplay } from './models/files-to-upload-display.model';

@Component({
  selector: 'gq-attachment-files-upload-modal',
  templateUrl: './attachment-files-upload-modal.component.html',
  imports: [
    DragAndDropDirective,
    CommonModule,
    MatIconModule,
    MatDialogModule,
    DialogHeaderModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SharedTranslocoModule,
    PushPipe,
    LoadingSpinnerModule,
    MatTooltipModule,
    InfoBannerComponent,
  ],
})
export class AttachmentFilesUploadModalComponent {
  private readonly dialogRef: MatDialogRef<AttachmentFilesUploadModalComponent> =
    inject(MatDialogRef);

  modalData: AttachmentDialogData = inject(MAT_DIALOG_DATA);
  attachmentsUploading$: Observable<boolean> = this.modalData.uploading$;

  private readonly MAX_FILE_SIZE = 5_240_000; // ~ 5MB

  filesToUpload = signal<FilesToUploadDisplay[]>([]);

  private readonly someFilesInvalid: WritableSignal<boolean> = signal(false);
  private readonly additionalDisableUploadButtonCondition = toSignal(
    this.modalData.additionalDisableUploadButtonCondition ?? of(null)
  );

  protected uploadDisabled = computed(() => {
    const additionalConditionToBeUsed =
      this.modalData.additionalDisableUploadButtonCondition !== null &&
      this.modalData.additionalDisableUploadButtonCondition !== undefined;
    const filesEmpty = this.filesToUpload().length === 0;
    const filesInvalid = this.someFilesInvalid();

    return additionalConditionToBeUsed
      ? (this.additionalDisableUploadButtonCondition() && filesEmpty) ||
          filesInvalid
      : filesEmpty || filesInvalid;
  });

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
    this.modalData.upload(
      this.filesToUpload()
        .filter(
          (filesToFilter) =>
            !filesToFilter.exists && !filesToFilter.sizeExceeded
        )
        .map((file) => file.file)
    );
    this.modalData.uploadSuccess$.pipe(take(1)).subscribe(() => {
      this.closeDialog();
    });
  }

  removeFile(file: FilesToUploadDisplay): void {
    this.filesToUpload.update((files) => files.filter((f) => f !== file));
    this.updateFileExistsStatus();
    this.checkForInvalidFiles();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private handleFileSelection(fileList: FileList) {
    // combine inputArray and files that are about to be uploaded
    const fileNamesArray = [
      ...this.filesToUpload().map((file) => file.file.name),
      ...this.modalData.fileNames(),
    ].map((fileName) => fileName.toLocaleLowerCase());

    // eslint-disable-next-line unicorn/prefer-spread
    Array.from(fileList).forEach((file) => {
      const fileToUpload: FilesToUploadDisplay = {
        file,
        sizeExceeded: file.size > this.MAX_FILE_SIZE,
        exists: this.checkFileNamesExists(fileNamesArray, file.name),
        unsupportedFileType: UNSUPPORTED_FILE_TYPES.some(
          (type) =>
            type.toLocaleLowerCase() === this.getFileExtension(file.name)
        ),
      };
      if (fileToUpload) {
        this.filesToUpload.set([...this.filesToUpload(), fileToUpload]);
      }
    });

    this.checkForInvalidFiles();
  }

  private checkForInvalidFiles(): void {
    this.someFilesInvalid.set(
      this.filesToUpload().some(
        (file) => file.sizeExceeded || file.exists || file.unsupportedFileType
      )
    );
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop().toLocaleLowerCase();
  }

  private checkFileNamesExists(fileNames: string[], fileName: string): boolean {
    return fileNames.some(
      (name) => name.toLocaleLowerCase() === fileName.toLocaleLowerCase()
    );
  }

  private updateFileExistsStatus(): void {
    this.filesToUpload.update((files) =>
      files.map((item) => ({
        ...item,
        exists: this.checkFileNamesExists(
          this.modalData.fileNames(),
          item.file.name
        ),
      }))
    );
  }
}
