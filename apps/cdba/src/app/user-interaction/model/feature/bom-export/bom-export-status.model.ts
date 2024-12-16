import { BomExportProgress } from './bom-export-status-enum.model';

export interface BomExportStatus {
  requestedBy: string;
  downloadUrl: string;
  downloadUrlExpiry: Date;
  progress: BomExportProgress;
  started: string;
  stopped: string;
}
