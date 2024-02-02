import { HeatType } from '../../../shared/models/employee/heat-type.enum';

export interface AttritionDialogFluctuationMeta {
  title: string;
  fluctuationRate?: number;
  unforcedFluctuationRate?: number;
  forcedFluctuationRate?: number;
  remainingFluctuationRate?: number;
  employeesLost: number;
  remainingFluctuation: number;
  forcedFluctuation: number;
  unforcedFluctuation: number;
  resignationsReceived: number;
  employeesAdded: number;
  openPositions: number;
  openPositionsAvailable: boolean;
  heatType: HeatType;
  hideDetailedLeaverStats: boolean;
}
