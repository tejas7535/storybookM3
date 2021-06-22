import { Component, Input } from '@angular/core';

import { GraphData } from '../../core/store/reducers/shared/models';

@Component({
  selector: 'goldwind-empty-graph',
  templateUrl: './empty-graph.component.html',
  styleUrls: ['./empty-graph.component.scss'],
})
export class EmptyGraphComponent {
  @Input() graphData: GraphData;

  emptyGraphData(): boolean {
    return (
      this.graphData?.legend.data.length !== 0 &&
      (this.graphData?.series as any)?.filter(
        (series: any) => series?.data?.length > 0
      ).length === 0
    );
  }
}
