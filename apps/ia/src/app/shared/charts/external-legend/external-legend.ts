import { ECharts } from 'echarts';

import { LegendSelectAction } from '../models';

/**
 * Abstract class to work with ExternalLegendComponent
 */
export abstract class ExternalLegend {
  /**
   * @property {ECharts} echartsInstance - Echarts instance
   */
  echartsInstance: ECharts;

  /**
   * @property {LegendSelectAction} legendSelectAction - consumed selection action
   */
  abstract legendSelectAction: LegendSelectAction;

  /**
   * Method to initialize @property {ECharts} echartsInstance.
   * It should be triggered on chartInit (Echarts) callback
   * @param ec - echarts instance
   */
  onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;
  }

  /**
   * Method for resetting state of selected legend' items.
   * Dispatches the Echarts' action to select all items from legend.
   */
  resetSelection(): void {
    this.echartsInstance?.dispatchAction({
      type: 'legendAllSelect',
    });
  }
}
