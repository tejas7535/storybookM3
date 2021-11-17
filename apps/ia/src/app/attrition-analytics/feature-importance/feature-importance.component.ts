import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { EChartsOption } from 'echarts';

import { FeatureImportanceTranslations } from '../models';
import { featuresImportance } from './data';
import { createFeaturesImportanceConfig } from './feature-importance.config';

@Component({
  selector: 'ia-feature-importance',
  templateUrl: './feature-importance.component.html',
})
export class FeatureImportanceComponent implements OnInit {
  readonly INTERVAL = 0.5;
  options: Observable<EChartsOption>;

  constructor(private readonly translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.options = this.translocoService
      .selectTranslateObject('featureImportance', {}, 'attrition-analytics')
      .pipe(
        map((translation: FeatureImportanceTranslations) =>
          createFeaturesImportanceConfig(
            featuresImportance,
            this.INTERVAL,
            translation.title,
            translation.xAxisName
          )
        )
      );
  }
}
