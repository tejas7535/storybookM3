import { LegendSquare } from '.';

export interface Series {
  value: string;
  name: string;
  color: string;
  identifier: string;
  dashStyle?: string;
  survivalProbability?: number;
  legendDisplay?: LegendSquare;
}
