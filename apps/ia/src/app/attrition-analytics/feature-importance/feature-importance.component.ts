import { Component, OnInit } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { EChartsOption } from 'echarts';

import {
  FeatureImportanceTranslations,
  FeatureLegendTranslations,
} from '../models';
import { featuresImportance } from './data/data';
import { createFeaturesImportanceConfig } from './feature-importance.config';

@Component({
  selector: 'ia-feature-importance',
  templateUrl: './feature-importance.component.html',
})
export class FeatureImportanceComponent implements OnInit {
  options: Observable<EChartsOption>;
  translation: FeatureLegendTranslations;

  constructor(private readonly translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.options = this.translocoService
      .selectTranslateObject('featureImportance', {}, 'attrition-analytics')
      .pipe(
        tap(
          (translation: FeatureImportanceTranslations) =>
            (this.translation = translation.legend)
        ),
        map((translation: FeatureImportanceTranslations) =>
          createFeaturesImportanceConfig(
            featuresImportance,
            translation.title,
            translation.xAxisName
          )
        )
      );
  }
}
