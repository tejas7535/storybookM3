export interface Alert {
  id?: string;
  open: boolean;
  priority: boolean;
  alertPriority: Priority;
  deactivated: boolean;
  customerNumber?: string;
  customerName?: string;
  materialNumber?: string;
  materialDescription?: string;
  type?: AlertCategory;
  createdAt?: string;
  changedAt?: string;
  dueDate?: string;
  materialClassification?: string;
  customerMaterialNumber?: string;
  customerMaterialNumberCount?: number;
  openFunction?: OpenFunction;
  currency?: string;
  threshold1?: number;
  threshold1Description?: string;
  threshold2?: number;
  threshold2Description?: string;
  threshold3?: number;
  threshold3Description?: string;
  thresholdDeviation?: number;
  comment?: string;
  changedBy?: string;
  completedAt?: string;
  completedBy?: string;
  createdBy?: string;
  generation?: string;
  keyAccount?: string;
  regionPlPackage?: string;
  threshold1Type?: string;
  threshold2Type?: string;
  threshold3Type?: string;
  calcThreshold1?: number;
  calcThreshold2?: number;
  calcThreshold3?: number;
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DEACTIVATED = 'DEACTIVATED',
}

export interface AlertNotificationCount {
  openCritical: number;
  openNonCritical: number;
}
export enum Priority {
  Priority1 = 1,
  Priority2 = 2,
  Priority3 = 3,
}

export enum OpenFunction {
  Validation_Of_Demand = 'VOD',
  Customer_Material_Portfolio = 'CMP',
}

export enum AlertCategory {
  CHKDMP = 'CHKDMP',
  DPLEOR = 'DPLEOR',
  DMPFIN = 'DMPFIN',
  DPOPDL = 'DPOPDL',
  CFPRAO = 'CFPRAO',
  CFSUAO = 'CFSUAO',
  PINWAO = 'PINWAO',
  PINWDP = 'PINWDP',
  PIOCAO = 'PIOCAO',
  PIOCDP = 'PIOCDP',
  PINUAO = 'PINUAO',
  PINUDP = 'PINUDP',
  PONWDP = 'PONWDP',
  IAUSDP = 'IAUSDP',
  IAUSAO = 'IAUSAO',
  ACIADP = 'ACIADP',
  SPNWAO = 'SPNWAO',
  SPSBDP = 'SPSBDP',
  REUDAO = 'REUDAO',
  REUSAO = 'REUSAO',
  RESEAO = 'RESEAO',
  RESEDP = 'RESEDP',
  SPCHDP = 'SPCHDP',
  SPCHAO = 'SPCHAO',
  DEVIFC = 'DEVIFC',
  SINWAO = 'SINWAO',
  NPOSDP = 'NPOSDP',
}

export const alertTypesToActivateToggleViaURL: AlertCategory[] = [
  AlertCategory.RESEDP, // Check substitution
  AlertCategory.REUSAO, // Check substitution, orders for predecessors
  AlertCategory.SINWAO, // Substitution Schaeffler intern activated
  AlertCategory.SPCHAO, // Substitution proposal changed
  AlertCategory.SPCHDP, // Substitution proposal changed
  AlertCategory.SPNWAO, // Check substitution proposal
  AlertCategory.SPSBDP, // Substitution proposal blocked
];
