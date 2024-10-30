// TODO align with Renè, where we should put this file. Old path: src/pages/customerMaterialPortfolio/modal/cmpModalStatusSpecificElements/cmp-modal-types.ts

import { DemandCharacteristic } from '../material-customer/model';

export type CMPData = CMPBaseData & CMPStatusSpecificChangeData;

export interface CMPBaseData {
  customerNumber: string;
  materialNumber: string;
  materialDescription: string | null;
  demandCharacteristic: DemandCharacteristic | null;
}

export const portfolioStatusValues = [
  'PI', // PhaseIn
  'PO', // PhaseOut
  'SP', // Substitution Proposal
  'SE', // Substitution External (Customer)
  'SI', // Substitution Internal (Schaeffler)
  'SB', // Substitution Blocked (Veto)
  'IA', // Inactive
  'AC', // Active
] as const;

export type PortfolioStatus = (typeof portfolioStatusValues)[number];

export const demandPlanAdoptionOptions = ['DELETE', 'COPY', 'ADD'] as const;

export type DemandPlanAdoption = (typeof demandPlanAdoptionOptions)[number];

export function parsePortfolioStatusOrNull(
  status: string
): PortfolioStatus | null {
  return portfolioStatusValues.includes(status as PortfolioStatus)
    ? (status as PortfolioStatus)
    : null;
}

export interface CMPStatusSpecificChangeData {
  portfolioStatus: PortfolioStatus | null;
  autoSwitchDate: Date | null;
  repDate: Date | null;
  successorMaterial: string | null;
  demandPlanAdoption: DemandPlanAdoption | null;
}
