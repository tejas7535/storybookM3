/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { CalculationParametersService } from '../../calculation-parameters/services';
import * as helpers from '../helpers/grease-helpers';
import {
  GreaseReportSubordinateDataItem,
  GreaseResultDataSourceItem,
  SubordinateDataItemField,
} from '../models';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';

@Injectable()
export class GreaseResultDataSourceService {
  private readonly tinyNumberFormatOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
  };

  public constructor(
    private readonly localeService: TranslocoLocaleService,
    private readonly undefinedValuePipe: UndefinedValuePipe,
    private readonly calculationParametersService: CalculationParametersService
  ) {}

  public isSufficient(dataItems: GreaseReportSubordinateDataItem[]): boolean {
    const initialGreaseQuantityValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.TFG_MIN
    );

    return !!initialGreaseQuantityValue;
  }

  public initialGreaseQuantity(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const initialGreaseQuantityValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.QVIN
    );

    return initialGreaseQuantityValue
      ? {
          title: 'initialGreaseQuantity',
          values: `${this.massTemplate(
            rho,
            +initialGreaseQuantityValue,
            '',
            true
          )}</br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              initialGreaseQuantityValue,
              'decimal'
            )} ${helpers.itemUnit(dataItems, SubordinateDataItemField.QVIN)}`
          )}`,
        }
      : undefined;
  }

  public manualRelubricationQuantityInterval(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const manualRelubricationQuantity =
      helpers.manualRelubricationQuantity(dataItems);
    const manualRelubricationQuantityTimeSpan =
      helpers.manualRelubricationQuantityTimeSpan(dataItems);

    return manualRelubricationQuantity && manualRelubricationQuantityTimeSpan
      ? {
          title: 'manualRelubricationQuantityInterval',
          values: `${this.massTemplate(
            rho,
            manualRelubricationQuantity,
            `${this.localeService.localizeNumber(
              manualRelubricationQuantityTimeSpan,
              'decimal'
            )} ${translate('calculationResult.days')}`,
            true
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              manualRelubricationQuantity,
              'decimal',
              undefined,
              this.tinyNumberFormatOptions
            )} ${helpers.itemUnit(
              dataItems,
              SubordinateDataItemField.QVRE_MAN_MIN
            )}/${this.localeService.localizeNumber(
              manualRelubricationQuantityTimeSpan,
              'decimal'
            )} ${translate('calculationResult.days')}`
          )}`,
          tooltip: 'manualRelubricationQuantityIntervalTooltip',
        }
      : undefined;
  }

  public automaticRelubricationQuantityPerDay(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const automaticRelubricationQuantityPerDayValue =
      helpers.automaticRelubricationQuantityPerDay(dataItems);

    return automaticRelubricationQuantityPerDayValue
      ? {
          title: 'automaticRelubricationQuantityPerDay',
          values: `${this.massTemplate(
            rho,
            automaticRelubricationQuantityPerDayValue,
            translate('calculationResult.day')
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              automaticRelubricationQuantityPerDayValue,
              'decimal'
            )} ${helpers.automaticRelubricationQuantityUnit(
              dataItems
            )}/${translate('calculationResult.day')}`
          )}`,
          tooltip: 'automaticRelubricationQuantityPerDayTooltip',
        }
      : undefined;
  }

  public greaseServiceLife(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const greaseServiceLifeValue = helpers.greaseServiceLife(dataItems);

    return greaseServiceLifeValue
      ? {
          title: 'greaseServiceLife',
          values: `~ ${this.localeService.localizeNumber(
            greaseServiceLifeValue,
            'decimal'
          )} ${translate('calculationResult.days')}`,
        }
      : undefined;
  }

  public automaticRelubricationPerWeek(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const automaticRelubricationPerWeekValue =
      helpers.automaticRelubricationPerWeek(dataItems);

    return automaticRelubricationPerWeekValue
      ? {
          title: 'automaticRelubricationPerWeek',
          values: `${this.massTemplate(
            rho,
            automaticRelubricationPerWeekValue,
            `7 ${translate('calculationResult.days')}`
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              automaticRelubricationPerWeekValue,
              'decimal'
            )} ${helpers.automaticRelubricationQuantityUnit(
              dataItems
            )}/7 ${translate('calculationResult.days')}`
          )}`,
        }
      : undefined;
  }

  public automaticRelubricationPerMonth(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const automaticRelubricationPerMonthValue =
      helpers.automaticRelubricationPerMonth(dataItems);

    return automaticRelubricationPerMonthValue
      ? {
          title: 'automaticRelubricationPerMonth',
          values: `${this.massTemplate(
            rho,
            automaticRelubricationPerMonthValue,
            `30 ${translate('calculationResult.days')}`,
            true
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              automaticRelubricationPerMonthValue,
              'decimal',
              undefined,
              this.tinyNumberFormatOptions
            )} ${helpers.automaticRelubricationQuantityUnit(
              dataItems
            )}/30 ${translate('calculationResult.days')}`
          )}`,
        }
      : undefined;
  }

  public automaticRelubricationPerYear(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const automaticRelubricationPerYearValue =
      helpers.automaticRelubricationPerYear(dataItems);

    return automaticRelubricationPerYearValue
      ? {
          title: 'automaticRelubricationPerYear',
          values: `${this.massTemplate(
            rho,
            automaticRelubricationPerYearValue,
            `365 ${translate('calculationResult.days')}`,
            true
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              automaticRelubricationPerYearValue,
              'decimal',
              undefined,
              this.tinyNumberFormatOptions
            )} ${helpers.automaticRelubricationQuantityUnit(
              dataItems
            )}/365 ${translate('calculationResult.days')}`
          )}`,
        }
      : undefined;
  }

  public viscosityRatio(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const viscosityRatioValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.KAPPA
    );

    return viscosityRatioValue
      ? {
          title: 'viscosityRatio',
          values: `${this.localeService.localizeNumber(
            viscosityRatioValue,
            'decimal'
          )}`,
        }
      : undefined;
  }

  public baseOilViscosityAt40(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const baseOilViscosityAt40Value = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.NY40
    );

    return baseOilViscosityAt40Value
      ? {
          title: 'baseOilViscosityAt40',
          values: `${this.localeService.localizeNumber(
            baseOilViscosityAt40Value,
            'decimal'
          )} ${helpers.itemUnit(dataItems, SubordinateDataItemField.NY40)}`,
        }
      : undefined;
  }

  public lowerTemperatureLimit(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const lowerTemperatureLimitValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.T_LIM_LOW
    );

    return lowerTemperatureLimitValue
      ? {
          title: 'lowerTemperatureLimit',
          values: `${this.localeService.localizeNumber(
            lowerTemperatureLimitValue,
            'decimal'
          )} ${helpers.itemUnit(
            dataItems,
            SubordinateDataItemField.T_LIM_LOW
          )}`,
          tooltip: 'lowerTemperatureLimitTooltip',
        }
      : undefined;
  }

  public upperTemperatureLimit(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const upperTemperatureLimitValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.T_LIM_UP
    );

    return upperTemperatureLimitValue
      ? {
          title: 'upperTemperatureLimit',
          values: `${this.localeService.localizeNumber(
            upperTemperatureLimitValue,
            'decimal'
          )} ${helpers.itemUnit(dataItems, SubordinateDataItemField.T_LIM_UP)}`,
          tooltip: 'upperTemperatureLimitTooltip',
        }
      : undefined;
  }

  public additiveRequired = (
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem => ({
    title: 'additiveRequired',
    values: `${this.undefinedValuePipe.transform(
      helpers.itemValue(dataItems, SubordinateDataItemField.ADD_REQ)
    )}`,
    tooltip: 'additiveRequiredTooltip',
  });

  public effectiveEpAdditivation = (
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem => ({
    title: 'effectiveEpAdditivation',
    values: `${this.undefinedValuePipe.transform(
      helpers.itemValue(dataItems, SubordinateDataItemField.ADD_W)
    )}`,
  });

  public density(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const densityValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.RHO
    );

    return densityValue
      ? {
          title: 'density',
          values: `${this.localeService.localizeNumber(
            densityValue,
            'decimal'
          )} ${helpers.itemUnit(dataItems, SubordinateDataItemField.RHO)}`,
        }
      : undefined;
  }

  public lowFriction(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const lowFrictionValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.F_LOW
    );

    const lowFrictionSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${lowFrictionValue}`
    );

    return {
      title: 'lowFriction',
      values:
        lowFrictionValue && lowFrictionSuitabilityLevel
          ? `${lowFrictionValue} (${translate(
              `calculationResult.suitabilityLevel${lowFrictionSuitabilityLevel}`
            )})`
          : translate('calculationResult.undefinedValue'),
    };
  }

  public suitableForVibrations(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const suitableForVibrationsValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.VIP
    );

    const suitableForVibrationsSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${suitableForVibrationsValue}`
    );

    return {
      title: 'suitableForVibrations',
      values:
        suitableForVibrationsValue && suitableForVibrationsSuitabilityLevel
          ? `${suitableForVibrationsValue} (${translate(
              `calculationResult.suitabilityLevel${suitableForVibrationsSuitabilityLevel}`
            )})`
          : translate('calculationResult.undefinedValue'),
    };
  }

  public supportForSeals(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem {
    const supportForSealsValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.SEAL
    );

    const supportForSealsSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${supportForSealsValue}`
    );

    return {
      title: 'supportForSeals',
      values:
        supportForSealsValue && supportForSealsSuitabilityLevel
          ? `${supportForSealsValue} (${translate(
              `calculationResult.suitabilityLevel${supportForSealsSuitabilityLevel}`
            )})`
          : translate('calculationResult.undefinedValue'),
    };
  }

  public h1Registration = (
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultDataSourceItem => ({
    title: 'h1Registration',
    values: `${this.undefinedValuePipe.transform(
      helpers.itemValue(dataItems, SubordinateDataItemField.NSF_H1)
    )}`,
  });

  private readonly massTemplate = (
    rho: number = 1,
    quantity: number,
    timespan?: string,
    tiny = false
  ): string => {
    const value = this.calculationParametersService.getWeightFromGram(
      rho * quantity
    );

    return value
      ? `<span>${
          tiny
            ? this.localeService.localizeNumber(
                value,
                'decimal',
                undefined,
                this.tinyNumberFormatOptions
              )
            : this.localeService.localizeNumber(value, 'decimal')
        } ${this.calculationParametersService.weightUnit()}${
          timespan ? `/${timespan}` : ''
        }</span>`
      : `<span>${translate('calculationResult.undefinedValue')}</span>`;
  };
}
