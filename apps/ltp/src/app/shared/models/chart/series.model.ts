import { LegendSquare } from '.';

export interface Series {
  identifier: string;
  value?: string;
  name?: string;
  color?: string;
  dashStyle?: string;
  survivalProbability?: number;
  type?: string;
  legendDisplay?: LegendSquare;
}
