import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FileStatus } from './file-status.model';

@Component({
  selector: 'sta-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() public readonly fileUploaded = new EventEmitter<File>();

  @Input() public readonly fileStatus: FileStatus;

  public uploadFile(fileList: FileList): void {
    const file = fileList[0];

    if (file) {
      this.fileUploaded.emit(file);
    }
  }
}
