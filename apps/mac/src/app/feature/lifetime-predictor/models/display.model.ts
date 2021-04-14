import { ChartType } from '../enums';

export interface Display {
  showMurakami: boolean;
  showFKM: boolean;
  showStatistical: boolean;
  chartType?: ChartType;
  bannerOpen?: boolean;
}
