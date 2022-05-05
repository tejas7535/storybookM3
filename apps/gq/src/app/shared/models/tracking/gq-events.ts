// Naming Convention:

import { ColumnFields } from '../../ag-grid/constants/column-fields.enum';
import { ExportExcel } from '../../components/modal/export-excel-modal/export-excel.enum';

// <app-area> - <user action> (<details (only if necessary)>)
export enum EVENT_NAMES {
  CASE_CREATION_STARTED = 'Case-View - Case creation started',
  CASE_CREATION_CANCELLED = 'Case-View - Case creation cancelled',
  CASE_CREATION_FINISHED = 'Case-View - Case creation finished',

  MASS_SIMULATION_STARTED = 'Process-Case - Mass Simulation started',
  MASS_SIMULATION_UPDATED = 'Process-Case - Mass Simulation updated',
  MASS_SIMULATION_CANCELLED = 'Process-Case - Mass Simulation cancelled',
  MASS_SIMULATION_FINISHED = 'Process-Case - Mass Simulation finished',

  SAP_DATA_REFRESHED = 'Process-Case - SAP data refreshed',

  EXCEL_DOWNLOAD_MODAL_OPENED = 'Process-Case - Excel download modal opened',
  EXCEL_DOWNLOAD_MODAL_CANCELLED = 'Process-Case - Excel download modal cancelled',
  EXCEL_DOWNLOADED = 'Process-Case - Excel file downloaded',

  GQ_PRICING_DETAILS_VIEWED = 'Detail-View - GQ pricing details viewed',
}

export enum CASE_CREATION_TYPES {
  SAP_IMPORT = 'SAP_IMPORT',
  FROM_CUSTOMER = 'FROM_CUSTOMER',
  MANUAL = 'MANUAL',
}

export interface CaseCreationEventParams {
  type: CASE_CREATION_TYPES;
}

export interface MassSimulationParams {
  type: ColumnFields;
  numberOfSimulatedRows?: number;
  simulatedValue?: number;
}

export interface ExcelDonwloadParams {
  type: ExportExcel;
}
