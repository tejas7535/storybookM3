import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sta-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() public readonly fileUploaded = new EventEmitter<File>();

  public uploadFile(fileList: FileList): void {
    const file = fileList[0];

    if (file) {
      this.fileUploaded.emit(file);
    }
  }
}
