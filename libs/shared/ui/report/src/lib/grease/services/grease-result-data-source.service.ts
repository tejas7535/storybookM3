/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { Field, TableItem } from '../../models';
import { GreaseResultDataSourceItem } from '../../models/grease-result.model';
import * as helpers from '../helpers/grease-helpers';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';

@Injectable()
export class GreaseResultDataSourceService {
  private readonly tinyNumberFormatOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
  };

  public constructor(
    private readonly localeService: TranslocoLocaleService,
    private readonly undefinedValuePipe: UndefinedValuePipe
  ) {}

  public initialGreaseQuantity(
    tableItems: TableItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const initialGreaseQuantityValue = helpers.itemValue(
      tableItems,
      Field.QVIN
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
            )} ${helpers.itemUnit(tableItems, Field.QVIN)}`
          )}`,
        }
      : undefined;
  }

  public manualRelubricationQuantityInterval(
    tableItems: TableItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const manualRelubricationQuantity =
      helpers.manualRelubricationQuantity(tableItems);
    const manualRelubricationQuantityTimeSpan =
      helpers.manualRelubricationQuantityTimeSpan(tableItems);

    return manualRelubricationQuantity && manualRelubricationQuantityTimeSpan
      ? {
          title: 'manualRelubricationQuantityInterval',
          values: `${this.massTemplate(
            rho,
            manualRelubricationQuantity,
            `${this.localeService.localizeNumber(
              manualRelubricationQuantityTimeSpan,
              'decimal'
            )} ${translate('days')}`,
            true
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              manualRelubricationQuantity,
              'decimal',
              undefined,
              this.tinyNumberFormatOptions
            )} ${helpers.itemUnit(
              tableItems,
              Field.QVRE_MAN_MIN
            )}/${this.localeService.localizeNumber(
              manualRelubricationQuantityTimeSpan,
              'decimal'
            )} ${translate('days')}`
          )}`,
          tooltip: 'manualRelubricationQuantityIntervalTooltip',
        }
      : undefined;
  }

  public automaticRelubricationQuantityPerDay(
    tableItems: TableItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const automaticRelubricationQuantityPerDayValue =
      helpers.automaticRelubricationQuantityPerDay(tableItems);

    return automaticRelubricationQuantityPerDayValue
      ? {
          title: 'automaticRelubricationQuantityPerDay',
          values: `${this.massTemplate(
            rho,
            automaticRelubricationQuantityPerDayValue,
            translate('day')
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              automaticRelubricationQuantityPerDayValue,
              'decimal'
            )} ${helpers.automaticRelubricationQuantityUnit(
              tableItems
            )}/${translate('day')}`
          )}`,
          tooltip: 'automaticRelubricationQuantityPerDayTooltip',
        }
      : undefined;
  }

  public greaseServiceLife(
    tableItems: TableItem[]
  ): GreaseResultDataSourceItem {
    const greaseServiceLifeValue = helpers.greaseServiceLife(tableItems);

    return greaseServiceLifeValue
      ? {
          title: 'greaseServiceLife',
          values: `~ ${this.localeService.localizeNumber(
            greaseServiceLifeValue,
            'decimal'
          )} ${translate('days')}`,
        }
      : undefined;
  }

  public automaticRelubricationPerWeek(
    tableItems: TableItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const automaticRelubricationPerWeekValue =
      helpers.automaticRelubricationPerWeek(tableItems);

    return automaticRelubricationPerWeekValue
      ? {
          title: 'automaticRelubricationPerWeek',
          values: `${this.massTemplate(
            rho,
            automaticRelubricationPerWeekValue,
            `7 ${translate('days')}`
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              automaticRelubricationPerWeekValue,
              'decimal'
            )} ${helpers.automaticRelubricationQuantityUnit(
              tableItems
            )}/7 ${translate('days')}`
          )}`,
        }
      : undefined;
  }

  public automaticRelubricationPerMonth(
    tableItems: TableItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const automaticRelubricationPerMonthValue =
      helpers.automaticRelubricationPerMonth(tableItems);

    return automaticRelubricationPerMonthValue
      ? {
          title: 'automaticRelubricationPerMonth',
          values: `${this.massTemplate(
            rho,
            automaticRelubricationPerMonthValue,
            `30 ${translate('days')}`,
            true
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              automaticRelubricationPerMonthValue,
              'decimal',
              undefined,
              this.tinyNumberFormatOptions
            )} ${helpers.automaticRelubricationQuantityUnit(
              tableItems
            )}/30 ${translate('days')}`
          )}`,
        }
      : undefined;
  }

  public automaticRelubricationPerYear(
    tableItems: TableItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const automaticRelubricationPerYearValue =
      helpers.automaticRelubricationPerYear(tableItems);

    return automaticRelubricationPerYearValue
      ? {
          title: 'automaticRelubricationPerYear',
          values: `${this.massTemplate(
            rho,
            automaticRelubricationPerYearValue,
            `365 ${translate('days')}`,
            true
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              automaticRelubricationPerYearValue,
              'decimal',
              undefined,
              this.tinyNumberFormatOptions
            )} ${helpers.automaticRelubricationQuantityUnit(
              tableItems
            )}/365 ${translate('days')}`
          )}`,
        }
      : undefined;
  }

  public viscosityRatio(tableItems: TableItem[]): GreaseResultDataSourceItem {
    const viscosityRatioValue = helpers.itemValue(tableItems, Field.KAPPA);

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
    tableItems: TableItem[]
  ): GreaseResultDataSourceItem {
    const baseOilViscosityAt40Value = helpers.itemValue(tableItems, Field.NY40);

    return baseOilViscosityAt40Value
      ? {
          title: 'baseOilViscosityAt40',
          values: `${this.localeService.localizeNumber(
            baseOilViscosityAt40Value,
            'decimal'
          )} ${helpers.itemUnit(tableItems, Field.NY40)}`,
        }
      : undefined;
  }

  public lowerTemperatureLimit(
    tableItems: TableItem[]
  ): GreaseResultDataSourceItem {
    const lowerTemperatureLimitValue = helpers.itemValue(
      tableItems,
      Field.T_LIM_LOW
    );

    return lowerTemperatureLimitValue
      ? {
          title: 'lowerTemperatureLimit',
          values: `${this.localeService.localizeNumber(
            lowerTemperatureLimitValue,
            'decimal'
          )} ${helpers.itemUnit(tableItems, Field.T_LIM_LOW)}`,
          tooltip: 'lowerTemperatureLimitTooltip',
        }
      : undefined;
  }

  public upperTemperatureLimit(
    tableItems: TableItem[]
  ): GreaseResultDataSourceItem {
    const upperTemperatureLimitValue = helpers.itemValue(
      tableItems,
      Field.T_LIM_UP
    );

    return upperTemperatureLimitValue
      ? {
          title: 'upperTemperatureLimit',
          values: `${this.localeService.localizeNumber(
            upperTemperatureLimitValue,
            'decimal'
          )} ${helpers.itemUnit(tableItems, Field.T_LIM_UP)}`,
          tooltip: 'upperTemperatureLimitTooltip',
        }
      : undefined;
  }

  public additiveRequired = (
    tableItems: TableItem[]
  ): GreaseResultDataSourceItem => ({
    title: 'additiveRequired',
    values: `${this.undefinedValuePipe.transform(
      helpers.itemValue(tableItems, Field.ADD_REQ)
    )}`,
    tooltip: 'additiveRequiredTooltip',
  });

  public effectiveEpAdditivation = (
    tableItems: TableItem[]
  ): GreaseResultDataSourceItem => ({
    title: 'effectiveEpAdditivation',
    values: `${this.undefinedValuePipe.transform(
      helpers.itemValue(tableItems, Field.ADD_W)
    )}`,
  });

  public density(tableItems: TableItem[]): GreaseResultDataSourceItem {
    const densityValue = helpers.itemValue(tableItems, Field.RHO);

    return densityValue
      ? {
          title: 'density',
          values: `${this.localeService.localizeNumber(
            densityValue,
            'decimal'
          )} ${helpers.itemUnit(tableItems, Field.RHO)}`,
        }
      : undefined;
  }

  public lowFriction(tableItems: TableItem[]): GreaseResultDataSourceItem {
    const lowFrictionValue = helpers.itemValue(tableItems, Field.F_LOW);

    const lowFrictionSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${lowFrictionValue}`
    );

    return {
      title: 'lowFriction',
      values:
        lowFrictionValue && lowFrictionSuitabilityLevel
          ? `${lowFrictionValue} (${translate(
              `suitabilityLevel${lowFrictionSuitabilityLevel}`
            )})`
          : translate('undefinedValue'),
    };
  }

  public suitableForVibrations(
    tableItems: TableItem[]
  ): GreaseResultDataSourceItem {
    const suitableForVibrationsValue = helpers.itemValue(tableItems, Field.VIP);

    const suitableForVibrationsSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${suitableForVibrationsValue}`
    );

    return {
      title: 'suitableForVibrations',
      values:
        suitableForVibrationsValue && suitableForVibrationsSuitabilityLevel
          ? `${suitableForVibrationsValue} (${translate(
              `suitabilityLevel${suitableForVibrationsSuitabilityLevel}`
            )})`
          : translate('undefinedValue'),
    };
  }

  public supportForSeals(tableItems: TableItem[]): GreaseResultDataSourceItem {
    const supportForSealsValue = helpers.itemValue(tableItems, Field.SEAL);

    const supportForSealsSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${supportForSealsValue}`
    );

    return {
      title: 'supportForSeals',
      values:
        supportForSealsValue && supportForSealsSuitabilityLevel
          ? `${supportForSealsValue} (${translate(
              `suitabilityLevel${supportForSealsSuitabilityLevel}`
            )})`
          : translate('undefinedValue'),
    };
  }

  public h1Registration = (
    tableItems: TableItem[]
  ): GreaseResultDataSourceItem => ({
    title: 'h1Registration',
    values: `${this.undefinedValuePipe.transform(
      helpers.itemValue(tableItems, Field.NSF_H1)
    )}`,
  });

  private readonly massTemplate = (
    rho: number = 1,
    quantity: number,
    timespan?: string,
    tiny = false
  ): string => {
    const value = rho * quantity;

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
        } ${translate('gramsAbbreviation')}${
          timespan ? `/${timespan}` : ''
        }</span>`
      : `<span>${translate('undefinedValue')}</span>`;
  };
}
