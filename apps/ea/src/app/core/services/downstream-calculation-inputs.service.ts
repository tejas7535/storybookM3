import { Injectable } from '@angular/core';

import { Greases } from '@ea/shared/constants/greases';
import { TranslocoService } from '@jsverse/transloco';

import { CATALOG_LUBRICATION_METHOD_KEY_MAPPING } from './catalog.service.constant';
import {
  DownstreamApiInputs,
  DownstreamAPIResponse,
} from './downstream-calculation.service.interface';
import {
  ELECTRICITY_REGION_KEY_MAPPING,
  ENERGY_SOURCES_TYPES,
  FOSSIL_FACTORS_KEY_MAPPING,
} from './downstream-calcululation.service.constant';

@Injectable({
  providedIn: 'root',
})
export class DownstreamCalculationInputsService {
  constructor(private readonly translocoService: TranslocoService) {}

  public formatDownstreamInputs(
    downstreamResponse: DownstreamAPIResponse
  ): DownstreamApiInputs {
    const product: DownstreamAPIResponse['product'] =
      downstreamResponse.product;
    const conditions = downstreamResponse.inputData.operatingConditions;

    const otherConditionsKeys = this.createTranslationKeys(
      'calculationResultReport.downstreamInputs.otherConditions',
      [
        'conditionsTitle',
        'temperature',
        'lubricationMethod',
        'greaseType',
        'svgClass',
        'viscosity',
        'ny40',
        'ny100',
        'operatingTimeInHours',
      ]
    );

    const bearingKeys = this.createTranslationKeys(
      'calculationResultReport.downstreamInputs.bearing',
      [
        'bearingTitle',
        'designation',
        'dynamicLoadRating',
        'fatigueLoadLimit',
        'innerDiameter',
        'limitingSpeedGrease',
        'limitingSpeedOil',
        'outerDiameter',
        'staticLoadRating',
        'width',
      ]
    );

    const energyPath = 'operationConditions.energySource';
    const energySourceKeys = {
      emissionFactor: `${energyPath}.title`,
      electric: `${energyPath}.options.electricity`,
      fossil: `${energyPath}.options.fossil`,
      fossilOrigin: `${energyPath}.fossilOrigin`,
      fossilOriginOptions: `${energyPath}.fossilOriginOptions.`,
      electricityRegion: `${energyPath}.electricityRegion`,
      electricityRegionValue: `${energyPath}.electricityRegionOption.`,
    };

    const loadKeys = this.createTranslationKeys(
      'calculationResultReport.downstreamInputs.load',
      [
        'loadTitle',
        'timePortion',
        'speed',
        'axialLoad',
        'radialLoad',
        'operatingTemperature',
      ]
    );

    const translationKeys: { [key: string]: string } = {
      ...otherConditionsKeys,
      ...bearingKeys,
      ...energySourceKeys,
      ...loadKeys,
      typeOfMotion: 'operationConditions.rotatingCondition.typeOfMotion',
    };

    const createSubItem = (
      key: string,
      value: any,
      unit?: string,
      abbreviation?: string
    ) => ({
      designation: this.translate(translationKeys[key]),
      value,
      unit,
      abbreviation,
      hasNestedStructure: false,
    });

    const lubricationMethod = CATALOG_LUBRICATION_METHOD_KEY_MAPPING.get(
      conditions.lubricationMethod
    );

    const baseConditions = [
      createSubItem('temperature', conditions.temperature, '°C', 't'),
      createSubItem('lubricationMethod', lubricationMethod),
    ];

    if (lubricationMethod === 'grease') {
      const grease = Greases.find((g) => g.value === conditions.greaseType);
      const greaseType = grease ? grease.label : conditions.greaseType;

      baseConditions.push(createSubItem('greaseType', greaseType));
    }

    if (conditions.viscosityDefinition === 'LB_ENTER_VISCOSITIES') {
      const viscosity = this.translate(translationKeys['viscosity']);
      baseConditions.push(
        createSubItem('svgClass', viscosity),
        createSubItem('ny40', conditions.ny40, 'mm²/s', 'ν 40'),
        createSubItem('ny40', conditions.ny100, 'mm²/s', 'v 100')
      );
    }

    if (conditions.viscosityDefinition === 'LB_ISO_VG_CLASS') {
      const svgClass = this.convertIsoVg(conditions.isoVgClass);
      baseConditions.push(createSubItem('svgClass', svgClass));
    }

    const bearingSubItems = [
      createSubItem('designation', product.designation),
      createSubItem('innerDiameter', product.innerDiameter, 'mm', 'd'),
      createSubItem('outerDiameter', product.outerDiameter, 'mm', 'D'),
      createSubItem('width', product.width, 'mm', 'B'),
      createSubItem('dynamicLoadRating', product.dynamicLoadRating, 'N', 'C'),
      createSubItem('staticLoadRating', product.staticLoadRating, 'N', 'C0'),
      createSubItem('fatigueLoadLimit', product.fatigueLoadLimit, 'N', 'Cu'),
      createSubItem(
        'limitingSpeedOil',
        product.limitingSpeedOil,
        '1/min',
        'n_lim_o'
      ),
      createSubItem(
        'limitingSpeedGrease',
        product.limitingSpeedGrease,
        '1/min',
        'n_lim_g'
      ),
    ];

    const factor = ENERGY_SOURCES_TYPES.get(conditions.emissionFactor);

    const downstreamConditions = [
      createSubItem('emissionFactor', this.translate(translationKeys[factor])),
    ];

    if (factor === 'electric') {
      const key = `${translationKeys['electricityRegionValue']}${ELECTRICITY_REGION_KEY_MAPPING.get(conditions.electricEmissionFactor)}`;
      downstreamConditions.push(
        createSubItem('electricityRegion', this.translate(key))
      );
    } else {
      const key = `${translationKeys['fossilOriginOptions']}${FOSSIL_FACTORS_KEY_MAPPING.get(conditions.fossilEmissionFactor)}`;
      downstreamConditions.push(
        createSubItem('fossilOrigin', this.translate(key))
      );
    }

    downstreamConditions.push(
      createSubItem(
        'operatingTimeInHours',
        conditions.operatingTimeInHours,
        'h'
      )
    );

    const loadCases: DownstreamApiInputs['load']['loadCases'] =
      downstreamResponse.inputData.loadcases.map((loadcase) => {
        const movementType = this.translate(
          `operationConditions.rotatingCondition.options.${loadcase.movementType}`
        );

        return {
          title: loadcase.designation,
          hasNestedStructure: false,
          subItems: [
            createSubItem('timePortion', loadcase.timePortion, '%', 'q'),
            createSubItem('typeOfMotion', movementType),
            createSubItem('speed', loadcase.speed, '1/min', 'n_i'),
            createSubItem(
              'operatingTemperature',
              loadcase.operatingTemperature,
              '°C',
              'T'
            ),
            createSubItem(
              'axialLoad',
              loadcase.axialLoad.toString(),
              'N',
              'Fa'
            ),
            createSubItem(
              'radialLoad',
              loadcase.radialLoad.toString(),
              'N',
              'Fr'
            ),
          ],
        };
      });

    return {
      bearing: {
        title: this.translate(translationKeys['bearingTitle']),
        subItems: bearingSubItems,
        hasNestedStructure: false,
      },
      operatingConditions: {
        title: this.translate(translationKeys['conditionsTitle']),
        baseConditions,
        downstreamConditions,
        hasNestedStructure: false,
      },
      load: {
        title: this.translate(translationKeys['loadTitle']),
        hasNestedStructure: true,
        loadCases,
      },
    };
  }

  private createTranslationKeys(
    basePath: string,
    keys: string[]
  ): { [key: string]: string } {
    // eslint-disable-next-line unicorn/no-array-reduce
    return keys.reduce(
      (acc, key) => {
        acc[key] = `${basePath}.${key}`;

        return acc;
      },
      {} as { [key: string]: string }
    );
  }

  private convertIsoVg(input: string): string {
    const regex = /LB_ISO_VG_(\d+)/;
    const match = regex.exec(input);

    return match ? `ISO VG ${match[1]}` : input;
  }

  private translate(path: string): string {
    return this.translocoService.translate(path);
  }
}
