import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileService {
  private co2UploadFile: File | undefined;

  public setCo2UploadFile(file?: File) {
    this.co2UploadFile = file;
  }

  public getCo2UploadFile() {
    return this.co2UploadFile;
  }
}
