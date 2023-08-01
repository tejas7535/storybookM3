import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'gq-attachment-files-upload-modal',
  templateUrl: './attachment-files-upload-modal.component.html',
})
export class AttachmentFilesUploadModalComponent {
  uploadDocument = 'Upload Document';
  selectedFilesList: string[] = [];
  loading: { [key: string]: boolean } = {};
  fileUploaded: { [key: string]: boolean } = {};
  date = Date.now();

  formGroup: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<AttachmentFilesUploadModalComponent>
  ) {}

  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;

    if (fileList) {
      const fileCount = fileList.length;
      for (let i = 0; i < fileCount; i = i + 1) {
        const file = fileList.item(i);
        if (file) {
          // Check if the file name exists in the selectedFilesList array
          const fileExists = this.selectedFilesList.includes(file.name);
          this.selectedFilesList.push(file.name); // Add each file name to the selectedFilesList array
          this.loading[file.name] = true;
          this.spinningAnimation(fileExists, file);
        }
      }
    }
    // Clear the file input value to allow selecting the same file again
    inputElement.value = '';
  }

  uploadToOther(): void {
    // Update the selectedFilesList using the DataSharingService
    this.dialogRef.close(this.selectedFilesList);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // this is temporary
  private spinningAnimation(fileExists: boolean, file: File) {
    if (fileExists) {
      this.loading[file.name] = false;
      this.fileUploaded[file.name] = true;
    } else {
      this.loading[file.name] = true;
      setTimeout(() => {
        this.loading[file.name] = false;
        this.fileUploaded[file.name] = true;
      }, 1000);
    }
  }
}
