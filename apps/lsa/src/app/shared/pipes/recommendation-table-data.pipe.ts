import { Pipe, PipeTransform } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { recommendationTableFields } from '@lsa/shared/constants';

import {
  Lubricator,
  RecommendationLubricatorHeaderData,
  RecommendationTableData,
} from '../models';

@Pipe({
  standalone: true,
  name: 'lsaRecommendationTableData',
})
export class RecommendationTableDataPipe implements PipeTransform {
  public transform(lubricators: {
    recommendedLubricator?: Lubricator;
    minimumRequiredLubricator?: Lubricator;
  }): RecommendationTableData {
    let recommended: RecommendationLubricatorHeaderData;
    let minimum: RecommendationLubricatorHeaderData;

    if (lubricators.recommendedLubricator) {
      recommended = {
        isRecommended: true,
        productImageUrl: lubricators.recommendedLubricator.productImageUrl,
        matNr: lubricators.recommendedLubricator.matNr,
        name: lubricators.recommendedLubricator.name,
        description: lubricators.recommendedLubricator.description,
      };
    }

    if (
      lubricators.minimumRequiredLubricator &&
      lubricators.minimumRequiredLubricator?.matNr !==
        lubricators.recommendedLubricator?.matNr
    ) {
      minimum = {
        isRecommended: false,
        productImageUrl: lubricators.minimumRequiredLubricator.productImageUrl,
        matNr: lubricators.minimumRequiredLubricator.matNr,
        name: lubricators.minimumRequiredLubricator.name,
        description: lubricators.minimumRequiredLubricator.description,
      };
    }

    const rows = recommendationTableFields.map((field) => ({
      field,
      minimum: this.getFieldValue(field, lubricators.minimumRequiredLubricator),
      recommended: this.getFieldValue(field, lubricators.recommendedLubricator),
    }));

    return {
      headers: {
        recommended,
        minimum,
      },
      rows,
    };
  }

  private getFieldValue(
    field: keyof Lubricator,
    lubricator?: Lubricator
  ): string | undefined {
    if (!lubricator) {
      return undefined;
    }

    switch (field) {
      case 'outputDiameter': {
        return `${lubricator[field]} ${this.getTranslation('centimeter')}`;
      }
      case 'maxOperatingPressure': {
        return `≤ ${lubricator[field]} ${this.getTranslation('bar')}`;
      }
      case 'maxTemp':
      case 'minTemp': {
        return `${lubricator[field]} ${this.getTranslation('degreeCelsius')}`;
      }
      case 'batteryPowered':
      case 'isOptime': {
        return `${this.getTranslation(lubricator[field] ? 'yes' : 'no')}`;
      }
      case 'volume': {
        return `${lubricator[field]} ${this.getTranslation('millilitre')}`;
      }
      default: {
        return `${lubricator[field]}`;
      }
    }
  }

  private getTranslation(key: string): string {
    return translate(`recommendation.result.${key}`);
  }
}
