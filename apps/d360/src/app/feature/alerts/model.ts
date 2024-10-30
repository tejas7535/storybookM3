export interface Alert {
  id?: string;
  open: boolean;
  priority: boolean;
  deactivated: boolean;
  customerNumber?: string;
  customerName?: string;
  materialNumber?: string;
  materialDescription?: string;
  type?: string;
  createdAt?: string;
  dueDate?: string;
  materialClassification?: string;
  customerMaterialNumber?: string;
  customerMaterialNumberCount?: number;
  openFunction?: string;
  threshold1?: number;
  threshold1Description?: string;
  threshold2?: number;
  threshold2Description?: string;
  threshold3?: number;
  threshold3Description?: string;
  thresholdDeviation?: number;
}

export type AlertStatus = 'ACTIVE' | 'COMPLETED' | 'DEACTIVATED';

export interface AlertNotificationCount {
  openCritical: number;
  openNonCritical: number;
}

export const AlertCategories = [
  'CHKDMP',
  'DPLEOR',
  'DMPFIN',
  'DPOPDL',
  'CFPRAO',
  'CFSUAO',
] as const;
export type AlertCategory = (typeof AlertCategories)[number];
