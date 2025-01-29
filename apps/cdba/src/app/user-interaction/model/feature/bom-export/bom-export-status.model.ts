import { BomExportProgress } from './bom-export-status-enum.model';

export interface BomExportStatus {
  requestedBy: string;
  downloadUrl: string;
  downloadUrlExpiry: string;
  progress: BomExportProgress;
  started: string;
  stopped: string;
}
