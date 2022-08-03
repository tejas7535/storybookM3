import { HeatType } from '../../../shared/models/employee/heat-type.enum';

export interface AttritionDialogFluctuationMeta {
  title: string;
  fluctuationRate: number;
  unforcedFluctuationRate: number;
  employeesLost: number;
  remainingFluctuation: number;
  forcedFluctuation: number;
  unforcedFluctuation: number;
  terminationReceived: number;
  employeesAdded: number;
  openPositions: number;
  heatType: HeatType;
}
