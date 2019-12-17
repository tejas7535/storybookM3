import { Component } from '@angular/core';

import { DataService } from '../../../shared/result/data.service';

@Component({
  selector: 'sta-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  constructor(private readonly dataService: DataService) {}

  public uploadFile(fileList: FileList): void {
    const file = fileList[0];

    if (file) {
      this.dataService.postTaggingFile(file);
    }
  }
}
