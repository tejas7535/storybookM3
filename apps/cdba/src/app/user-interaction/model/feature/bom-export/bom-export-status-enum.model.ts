export enum BomExportProgress {
  STARTED = 'STARTED',
  // General Status
  IN_PROGRESS_1 = 'IN_PROGRESS_1',
  // Validate access
  IN_PROGRESS_2 = 'IN_PROGRESS_2',
  // Extract Calculations from Denodo
  IN_PROGRESS_3 = 'IN_PROGRESS_3',
  // Create BOM Identifiers from Calculations
  IN_PROGRESS_4 = 'IN_PROGRESS_4',
  // Export BOM from OData
  IN_PROGRESS_5 = 'IN_PROGRESS_5',
  // Create Workbook
  IN_PROGRESS_6 = 'IN_PROGRESS_6',
  // Upload Workbook to Blob Storage
  IN_PROGRESS_7 = 'IN_PROGRESS_7',
  // Generate SAS token
  IN_PROGRESS_8 = 'IN_PROGRESS_8',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED',
}

export const BOM_EXPORT_RUNNING = [
  BomExportProgress.IN_PROGRESS_1,
  BomExportProgress.IN_PROGRESS_2,
  BomExportProgress.IN_PROGRESS_3,
  BomExportProgress.IN_PROGRESS_4,
  BomExportProgress.IN_PROGRESS_5,
  BomExportProgress.IN_PROGRESS_6,
  BomExportProgress.IN_PROGRESS_7,
  BomExportProgress.IN_PROGRESS_8,
];
