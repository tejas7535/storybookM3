import { Component, Input } from '@angular/core';

import { ChartLegendItem } from '../models/chart-legend-item.model';

@Component({
  selector: 'ia-chart-legend',
  templateUrl: './chart-legend.component.html',
  standalone: false,
})
export class ChartLegendComponent {
  @Input() items: ChartLegendItem[];
  @Input() title: string;
}
