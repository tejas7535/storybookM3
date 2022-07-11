import { HeatType } from '../../../shared/models/employee/heat-type.enum';

export interface AttritionDialogFluctuationMeta {
  title: string;
  fluctuationRate: number;
  unforcedFluctuationRate: number;
  employeesLost: number;
  naturalTurnover: number;
  forcedLeavers: number;
  unforcedLeavers: number;
  terminationReceived: number;
  employeesAdded: number;
  openPositions: number;
  heatType: HeatType;
}
