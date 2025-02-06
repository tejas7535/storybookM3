import { formatISO } from 'date-fns';

import { ResponseWithResultMessage } from '../../shared/utils/error-handling';

export interface AlertRuleResponse {
  count: number;
  content: AlertRule[];
}

export interface AlertRule {
  id: string;
  deleteData?: boolean | null;
  salesArea?: string | null;
  salesOrg?: string | null;
  type?: string | null;
  customerNumber?: string | null;
  customerName?: string | null;
  materialNumber?: string | null;
  materialDescription?: string | null;
  materialClassification?: string | null;
  sectorManagement?: string | null;
  productionLine?: string | null;
  productLine?: string | null;
  demandPlannerId?: string | null;
  demandPlanner?: string | null;
  gkamNumber?: string | null;
  gkamName?: string | null;
  startDate: Date | null;
  execDay?: ExecDay | null;
  execInterval?: ExecInterval | null;
  endDate: Date | null;
  deactivated?: boolean | null;
  activeCount?: number | null;
  inactiveCount?: number | null;
  completedCount?: number | null;
  alertComment?: string | null;
  region?: string | null;
  generation?: string | null;
  usernameCreated?: string | null;
  usernameLastChanged?: string | null;
  threshold1?: string | null;
  threshold1Description?: string | null;
  threshold1Type?: string | null;
  threshold2?: string | null;
  threshold2Description?: string | null;
  threshold2Type?: string | null;
  threshold3?: string | null;
  threshold3Description?: string | null;
  threshold3Type?: string | null;
  currency?: string | null;
}

export interface AlertTypeDescription {
  alertType: string;
  defaultName: string;
  description: string;
  generation: string;
  threshold1Description: string;
  threshold1Type: string;
  threshold2Description: string;
  threshold2Type: string;
  threshold3Description: string;
  threshold3Type: string;
}

export const execIntervallValues = [
  'M1',
  'M2',
  'M3',
  'M6',
  'W1',
  'D1',
] as const;
export type ExecInterval = (typeof execIntervallValues)[number];
export const execDayValues = ['M01', 'M15', 'W6', 'D'] as const;
export type ExecDay = (typeof execDayValues)[number];

export type AlertRuleSaveResponse = {
  id?: string | null;
  deleteData?: boolean | null;
  type?: string | null;
  region?: string | null;
  salesArea?: string | null;
  salesOrg?: string | null;
  customerNumber?: string | null;
  customerName?: string | null;
  materialNumber?: string | null;
  materialDescription?: string | null;
  materialClassification?: string | null;
  sectorManagement?: string | null;
  demandPlannerId?: string | null;
  productionLine?: string | null;
  productLine?: string | null;
  gkamNumber?: string | null;
  startDate: string | null;
  execDay?: string | null;
  execInterval?: string | null;
  endDate?: string | null;
  generation?: string | null;
  inactiveCount?: string | null;
  currency?: string | null;
  alertComment?: string | null;
  threshold1?: string | null;
  threshold2?: string | null;
  threshold3?: string | null;
  deactivated?: boolean | null;
} & ResponseWithResultMessage;

export interface AlertRuleSaveRequest {
  id: string;
  deleteData?: boolean | null;
  type?: string | null;
  region?: string | null;
  salesArea?: string | null;
  salesOrg?: string | null;
  customerNumber?: string | null;
  customerName?: string | null;
  materialNumber?: string | null;
  materialDescription?: string | null;
  materialClassification?: string | null;
  sectorManagement?: string | null;
  demandPlannerId?: string | null;
  productionLine?: string | null;
  productLine?: string | null;
  gkamNumber?: string | null;
  startDate?: string | null;
  execDay?: string | null;
  execInterval?: string | null;
  endDate?: string | null;
  generation?: string | null;
  inactiveCount?: string | null;
  currency?: string | null;
  alertComment?: string | null;
  threshold1?: string | null;
  threshold2?: string | null;
  threshold3?: string | null;
  deactivated?: boolean | null;
}

export function dataToAlertRuleRequest(data: AlertRule): AlertRuleSaveRequest {
  const startDate = data.startDate;
  const endDate = data.endDate;

  return {
    id: data.id,
    deleteData: data.deleteData,
    type: data.type,
    region: data.region,
    salesArea: data.salesArea,
    salesOrg: data.salesOrg,
    customerNumber: data.customerNumber,
    customerName: data.customerName,
    materialNumber: data.materialNumber,
    materialDescription: data.materialDescription,
    materialClassification: data.materialClassification,
    sectorManagement: data.sectorManagement,
    demandPlannerId: data.demandPlannerId,
    productionLine: data.productionLine,
    productLine: data.productLine,
    gkamNumber: data.gkamNumber,
    startDate: startDate
      ? formatISO(startDate, {
          representation: 'date',
        })
      : null,
    execDay: data.execDay,
    execInterval: data.execInterval,
    endDate: endDate
      ? formatISO(endDate, {
          representation: 'date',
        })
      : null,
    generation: data.generation,
    currency: data.currency,
    alertComment: data.alertComment,
    threshold1: data.threshold1,
    threshold2: data.threshold2,
    threshold3: data.threshold3,
    deactivated: data.deactivated,
  };
}
