import { Pipe, PipeTransform } from '@angular/core';

import { translate } from '@jsverse/transloco';
import {
  LubricatorType,
  recommendationTableConfiguration,
} from '@lsa/shared/constants';

import {
  Lubricator,
  RecommendationLubricatorHeaderData,
  RecommendationTableData,
  RecommendationTableRow,
} from '../models';

interface LubricatorsParameter {
  recommendedLubricator?: Lubricator;
  minimumRequiredLubricator?: Lubricator;
}

@Pipe({
  standalone: true,
  name: 'lsaRecommendationTableData',
})
export class RecommendationTableDataPipe implements PipeTransform {
  public transform(lubricators: LubricatorsParameter): RecommendationTableData {
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

    const rows: RecommendationTableRow[] = recommendationTableConfiguration.map(
      (config) => {
        if (typeof config === 'string') {
          return {
            field: config,
            minimum: this.getFieldValue(
              config,
              lubricators.minimumRequiredLubricator
            ),
            recommended: this.getFieldValue(
              config,
              lubricators.recommendedLubricator
            ),
          };
        }

        if (config.type === 'technical') {
          return this.pickTechnicalAttribute(config.fieldName, lubricators);
        } else if (config.type === 'composite') {
          return this.customFieldDef(
            config.fieldName,
            lubricators,
            config.formatFunction
          );
        }

        return {} as RecommendationTableRow;
      }
    );

    return {
      headers: {
        recommended,
        minimum,
      },
      rows,
    };
  }

  private customFieldDef(
    field: string,
    lubricators: LubricatorsParameter,
    format: (element: Lubricator, lub: LubricatorType) => string
  ): RecommendationTableRow {
    return {
      field,
      minimum: lubricators.minimumRequiredLubricator
        ? format(lubricators.minimumRequiredLubricator, 'minimum')
        : undefined,
      recommended: lubricators.recommendedLubricator
        ? format(lubricators.recommendedLubricator, 'recommended')
        : undefined,
    } as RecommendationTableRow;
  }

  private pickTechnicalAttribute(
    field: number | string,
    lubricators: LubricatorsParameter
  ): RecommendationTableRow {
    return {
      field: `${field}`,
      minimum: lubricators.minimumRequiredLubricator
        ? lubricators.minimumRequiredLubricator.technicalAttributes[field]
        : undefined,
      recommended: lubricators.recommendedLubricator
        ? lubricators.recommendedLubricator.technicalAttributes[field]
        : undefined,
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
