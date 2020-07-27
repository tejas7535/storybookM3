import { ChartType } from '../enums';

export interface Display {
  showMurakami: boolean;
  showFKM: boolean;
  chartType?: ChartType;
  bannerOpen?: boolean;
}
