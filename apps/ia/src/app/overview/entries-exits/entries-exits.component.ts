import { Component, OnInit } from '@angular/core';

import { DoughnutConfig } from './doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from './doughnut-chart/models/doughnut-series-config.model';

@Component({
  selector: 'ia-entries-exits',
  templateUrl: './entries-exits.component.html',
})
export class EntriesExitsComponent implements OnInit {
  entriesDoughnutConfig: DoughnutConfig;
  exitsDoughnutConfig: DoughnutConfig;

  ngOnInit(): void {
    const legend = ['external', 'internal'];

    this.entriesDoughnutConfig = new DoughnutConfig('Entries', [], legend);

    const exitsDoughnutSeriesExternal = new DoughnutSeriesConfig(
      70,
      'external'
    );
    const exitsDoughnutSeriesInternal = new DoughnutSeriesConfig(
      20,
      'internal'
    );
    this.exitsDoughnutConfig = new DoughnutConfig(
      'Exits',
      [exitsDoughnutSeriesInternal, exitsDoughnutSeriesExternal],
      legend
    );
  }
}
