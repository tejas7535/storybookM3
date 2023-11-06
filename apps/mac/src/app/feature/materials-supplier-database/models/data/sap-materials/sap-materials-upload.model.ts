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

export interface SapMaterialsDatabaseUploadStatusResponse {
  timestamp: Date;
  status: SapMaterialsDatabaseUploadStatus;
}

export enum SapMaterialsDatabaseUploadStatus {
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}
