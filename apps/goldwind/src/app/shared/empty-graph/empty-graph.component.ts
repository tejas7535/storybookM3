import { Component, Input } from '@angular/core';

import { EChartsOption, LegendComponentOption, SeriesOption } from 'echarts';

@Component({
  selector: 'goldwind-empty-graph',
  templateUrl: './empty-graph.component.html',
  styleUrls: ['./empty-graph.component.scss'],
})
export class EmptyGraphComponent {
  @Input() graphData: EChartsOption;

  emptyGraphData(): boolean {
    return (
      (this.graphData?.legend as LegendComponentOption)?.data.length > 0 &&
      (this.graphData?.series as SeriesOption[])?.filter(
        (series: any) => series?.data?.length > 0
      ).length === 0
    );
  }
}
