import { Moment } from 'moment';

export interface SapMaterialsUpload {
  owner: string;
  date: Moment;
  maturity: number;
  file: File;
}

export interface SapMaterialsUploadResponse {
  uploadId: string;
}
