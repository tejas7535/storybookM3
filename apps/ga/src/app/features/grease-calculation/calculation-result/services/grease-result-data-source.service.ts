/* eslint-disable max-lines */
import { inject, Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';

import { CalculationParametersService } from '../../calculation-parameters/services';
import * as helpers from '../helpers/grease-helpers';
import {
  CONCEPT1,
  GreaseConcep1Suitablity,
  GreaseReportConcept1Subordinate,
  GreaseReportSubordinateDataItem,
  GreaseReportSubordinateTitle,
  GreaseResultDataSourceItem,
  GreaseResultItem,
  SubordinateDataItemField,
  SUITABILITY,
} from '../models';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';

@Injectable()
export class GreaseResultDataSourceService {
  private readonly undefinedValuePipe = inject(UndefinedValuePipe);
  private readonly calculationParametersService = inject(
    CalculationParametersService
  );

  private readonly daysInYear = 365;

  public isSufficient(dataItems: GreaseReportSubordinateDataItem[]): boolean {
    const initialGreaseQuantityValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.TFG_MIN
    );

    return !!initialGreaseQuantityValue;
  }

  public automaticLubrication(
    subordinates: GreaseReportConcept1Subordinate[],
    index: number
  ): GreaseResultDataSourceItem {
    const item = subordinates?.find(
      ({ titleID }) =>
        titleID === GreaseReportSubordinateTitle.STRING_OUTP_CONCEPT1
    )?.data.items[index];

    const suitability = subordinates?.find(
      ({ title }) =>
        title ===
        `${
          item.find(({ field }) => field === SubordinateDataItemField.C1)?.value
        }:`
    )?.titleID;

    const autohint = subordinates?.find(
      ({ titleID }) => titleID === suitability
    )?.subordinates[0].text[0];

    const c1_60 =
      suitability !== SUITABILITY.NO &&
      helpers.getConcept1Setting(item, SubordinateDataItemField.C1_60);

    const hint_60 = this.get60mlHintNote(c1_60, item);

    const c1_125 =
      suitability !== SUITABILITY.NO &&
      helpers.getConcept1Setting(item, SubordinateDataItemField.C1_125);

    const hint_125 = this.get125mlHintNote(c1_125, item);

    const anySetting = !!(c1_60 || c1_125);

    const hint =
      suitability === SUITABILITY.YES && !anySetting
        ? translate('calculationResult.concept1settings.adjustConditions')
        : autohint;

    const label = helpers.getLabel(suitability as SUITABILITY, anySetting);

    const data: GreaseConcep1Suitablity = {
      hint,
      label,
      c1_60,
      c1_125,
      hint_60,
      hint_125,
    };

    return {
      title: 'concept1',
      custom: {
        selector: CONCEPT1,
        data,
      },
    };
  }

  public initialGreaseQuantity(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> | undefined {
    const initialGreaseQuantityValueVolumeRaw = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.QVIN
    );

    const initialGreaseQuantityValueVolume = this.roundValue(
      +initialGreaseQuantityValueVolumeRaw
    );

    const initialGreaseQuantityMass = this.calculateMass(
      rho,
      +initialGreaseQuantityValueVolumeRaw
    );

    return initialGreaseQuantityValueVolumeRaw
      ? {
          title: 'initialGreaseQuantity',
          value: initialGreaseQuantityMass.value,
          prefix: initialGreaseQuantityMass.prefix,
          unit: initialGreaseQuantityMass.unit,
          secondaryValue: initialGreaseQuantityValueVolume.roundedValue,
          secondaryPrefix: initialGreaseQuantityValueVolume.prefix,
          secondaryUnit: helpers.itemUnit(
            dataItems,
            SubordinateDataItemField.QVIN
          ),
        }
      : undefined;
  }

  public relubricationQuantityPer1000OperatingHours(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> | undefined {
    const numberOfHours = 1000;
    const relubricationQuantityPerOperatingHoursVolumeRaw =
      helpers.relubricationPerOperatingHours(numberOfHours, dataItems);

    const relubricationQuantityPerOperatingHoursVolume = this.roundValue(
      relubricationQuantityPerOperatingHoursVolumeRaw
    );

    const relubricationQuantityPerOperatingHoursMass = this.calculateMass(
      rho,
      relubricationQuantityPerOperatingHoursVolumeRaw,
      translate('calculationResult.hours', { hours: numberOfHours })
    );

    return relubricationQuantityPerOperatingHoursVolumeRaw
      ? {
          title: 'relubricationQuantityPer1000OperatingHours',
          value: relubricationQuantityPerOperatingHoursMass.value,
          prefix: relubricationQuantityPerOperatingHoursMass.prefix,
          unit: relubricationQuantityPerOperatingHoursMass.unit,
          secondaryValue:
            relubricationQuantityPerOperatingHoursVolume.roundedValue,
          secondaryPrefix: relubricationQuantityPerOperatingHoursVolume.prefix,
          secondaryUnit: `${helpers.relubricationQuantityUnit(dataItems)}/${translate(
            'calculationResult.hours',
            { hours: numberOfHours }
          )}`,
        }
      : undefined;
  }

  public greaseServiceLife(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<number> | undefined {
    const greaseServiceLifeValue = helpers.greaseServiceLife(dataItems);

    return greaseServiceLifeValue
      ? {
          title: 'greaseServiceLife',
          value: greaseServiceLifeValue,
          prefix: '~',
          unit: translate('calculationResult.days'),
        }
      : undefined;
  }

  public maximumManualRelubricationInterval(
    items: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> | undefined {
    const interval = helpers.relubricationIntervalInDays(items);

    const days = interval > this.daysInYear ? this.daysInYear : interval;

    /*
      Qvre_man_min and Qvre_man_max are not used in the calculation as it is combined value per interval,
      so for an example if the result of relubricationIntervalInDays is 870 days then the unit of value is cm³/870 days,
      which is not suitable for the scenario where we exceed 365 days.
      the outcome of the calculation should equal to average of Qvre_man_min and Qvre_man_max , if the interval is less than 365 days. 

      Qvre_aut_min and Qvre_aut_max are defined as per day values which are easier used in the calculation.
    */
    const relubricationDays = helpers.relubricationPerDays(days, items);

    if (!relubricationDays) {
      return undefined;
    }

    const result = this.getMaxRelubricationItem(
      items,
      rho,
      relubricationDays,
      days
    );

    return result;
  }

  public maxManualRelubricationIntervalForVerticalAxis(
    items: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> | undefined {
    const MAX_DAYS = 7;

    const interval = helpers.relubricationIntervalInDaysFromMaxValue(items);
    const days = interval > MAX_DAYS ? MAX_DAYS : interval;

    const relubricationDays = helpers.maximumRelubricationPerDays(days, items);

    if (!relubricationDays) {
      return undefined;
    }

    const result = this.getMaxRelubricationItem(
      items,
      rho,
      relubricationDays,
      days
    );

    return result;
  }

  public relubricationInterval(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<number> | undefined {
    const relubricationIntervalValue =
      helpers.relubricationIntervalInDays(dataItems);

    return relubricationIntervalValue
      ? {
          title: 'relubricationInterval',
          value: relubricationIntervalValue,
          prefix: '~',
          unit: translate('calculationResult.days'),
          tooltip: 'relubricationIntervalTooltip',
        }
      : undefined;
  }

  public relubricationPer365Days(
    items: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> {
    return this.getAverageLubricationPerDays(
      365,
      items,
      rho,
      'relubricationQuantityPer365daysTooltip'
    );
  }

  public relubricationPer30Days(
    items: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> {
    return this.getAverageLubricationPerDays(30, items, rho);
  }

  public relubricationPer7Days(
    items: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> {
    return this.getAverageLubricationPerDays(7, items, rho);
  }
  public getMaximumLubricationPer7Days(
    items: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> | undefined {
    return this.getMaximumLubricationPerDays(7, items, rho);
  }

  public lowerTemperatureLimit(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<number> | undefined {
    const lowerTemperatureLimitValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.T_LIM_LOW
    );

    return lowerTemperatureLimitValue
      ? {
          title: 'lowerTemperatureLimit',
          value: +lowerTemperatureLimitValue,
          unit: helpers.itemUnit(dataItems, SubordinateDataItemField.T_LIM_LOW),
          tooltip: 'lowerTemperatureLimitTooltip',
        }
      : undefined;
  }

  public upperTemperatureLimit(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<number> | undefined {
    const upperTemperatureLimitValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.T_LIM_UP
    );

    return upperTemperatureLimitValue
      ? {
          title: 'upperTemperatureLimit',
          value: +upperTemperatureLimitValue,
          unit: helpers.itemUnit(dataItems, SubordinateDataItemField.T_LIM_UP),
          tooltip: 'upperTemperatureLimitTooltip',
        }
      : undefined;
  }

  public baseOilViscosityAt40(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<number> | undefined {
    const baseOilViscosityAt40Value = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.NY40
    );

    return baseOilViscosityAt40Value
      ? {
          title: 'baseOilViscosityAt40',
          value: +baseOilViscosityAt40Value,
          unit: helpers.itemUnit(dataItems, SubordinateDataItemField.NY40),
        }
      : undefined;
  }

  public viscosityRatio(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<number> | undefined {
    const viscosityRatioValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.KAPPA
    );

    return viscosityRatioValue
      ? {
          title: 'viscosityRatio',
          value: +viscosityRatioValue,
        }
      : undefined;
  }

  public additiveRequired(
    items: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<string> {
    return {
      title: 'additiveRequired',
      value: `${this.undefinedValuePipe.transform(
        helpers.itemValue(items, SubordinateDataItemField.ADD_REQ)
      )}`,
      tooltip: 'additiveRequiredTooltip',
    };
  }

  public effectiveEpAdditivation(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<string> {
    return {
      title: 'effectiveEpAdditivation',
      value: `${this.undefinedValuePipe.transform(
        helpers.itemValue(dataItems, SubordinateDataItemField.ADD_W)
      )}`,
    };
  }

  public suitableForVibrations(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<string> {
    const suitableForVibrationsValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.VIP
    );

    const suitableForVibrationsSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${suitableForVibrationsValue}`
    );

    return {
      title: 'suitableForVibrations',
      value:
        suitableForVibrationsValue && suitableForVibrationsSuitabilityLevel
          ? `${suitableForVibrationsValue} (${translate(
              `calculationResult.suitabilityLevel${suitableForVibrationsSuitabilityLevel}`
            )})`
          : translate('calculationResult.undefinedValue'),
    };
  }

  public supportForSeals(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<string> {
    const supportForSealsValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.SEAL
    );

    const supportForSealsSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${supportForSealsValue}`
    );

    return {
      title: 'supportForSeals',
      value:
        supportForSealsValue && supportForSealsSuitabilityLevel
          ? `${supportForSealsValue} (${translate(
              `calculationResult.suitabilityLevel${supportForSealsSuitabilityLevel}`
            )})`
          : translate('calculationResult.undefinedValue'),
    };
  }

  public lowFriction(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<string> {
    const lowFrictionValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.F_LOW
    );

    const lowFrictionSuitabilityLevel = helpers.mapSuitabilityLevel(
      `${lowFrictionValue}`
    );

    return {
      title: 'lowFriction',
      value:
        lowFrictionValue && lowFrictionSuitabilityLevel
          ? `${lowFrictionValue} (${translate(
              `calculationResult.suitabilityLevel${lowFrictionSuitabilityLevel}`
            )})`
          : translate('calculationResult.undefinedValue'),
    };
  }

  public density(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<number> | undefined {
    const densityValue = helpers.itemValue(
      dataItems,
      SubordinateDataItemField.RHO
    );

    return densityValue
      ? {
          title: 'density',
          value: +densityValue,
          unit: helpers.itemUnit(dataItems, SubordinateDataItemField.RHO),
        }
      : undefined;
  }

  public h1Registration(
    dataItems: GreaseReportSubordinateDataItem[]
  ): GreaseResultItem<string> {
    return {
      title: 'h1Registration',
      value: `${this.undefinedValuePipe.transform(
        helpers.itemValue(dataItems, SubordinateDataItemField.NSF_H1)
      )}`,
    };
  }

  private getMaxRelubricationItem(
    items: GreaseReportSubordinateDataItem[],
    rho: number,
    relubricationPerDays: number,
    numberOfDays: number
  ): GreaseResultItem<number> {
    const relubricationPerDaysVolume = this.roundValue(relubricationPerDays);

    const relubricationPerDaysMass = this.calculateMass(
      rho,
      relubricationPerDays,
      `${numberOfDays} ${translate('calculationResult.days')}`
    );

    return {
      title: `maximumManualRelubricationPerInterval`,
      value: relubricationPerDaysMass.value,
      prefix: relubricationPerDaysMass.prefix,
      unit: relubricationPerDaysMass.unit,
      secondaryValue: relubricationPerDaysVolume.roundedValue,
      secondaryPrefix: relubricationPerDaysVolume.prefix,
      secondaryUnit: `${helpers.relubricationQuantityUnit(
        items
      )}/${numberOfDays} ${translate('calculationResult.days')}`,
    };
  }

  private readonly calculateMass = (
    rho: number,
    quantity: number,
    timespan?: string
  ): { value: number | undefined; prefix: string; unit?: string } => {
    const value =
      (rho || this.calculationParametersService.getDensity()) * quantity;

    const { roundedValue, prefix } = this.roundValue(value);

    const timespanString = timespan ? `/${timespan}` : '';

    const unit = `${this.calculationParametersService.weightUnit()}${timespanString}`;

    return {
      value: value ? roundedValue : undefined,
      prefix,
      unit,
    };
  };

  private readonly roundValue = (
    value: number
  ): { roundedValue: number | undefined; prefix: string } => {
    let prefix = '';

    if (!value) {
      return {
        roundedValue: undefined,
        prefix: '',
      };
    }

    const precision = 1;
    const rounder = Math.pow(10, 2);
    let result = +(Math.round(value * rounder) / rounder).toFixed(precision);

    if (result === 0) {
      prefix = '~';

      result = 0.1;
    }

    return {
      roundedValue: result,
      prefix,
    };
  };

  private readonly get60mlHintNote = (
    c1_60: number | undefined,
    item: GreaseReportSubordinateDataItem[]
  ): string | undefined => {
    const note60mlOvergreased = '1';

    const overgreasingInfo = this.isOvergreased(item, note60mlOvergreased)
      ? translate('calculationResult.concept1settings.size60PossibleHint')
      : undefined;

    return c1_60
      ? overgreasingInfo
      : translate('calculationResult.concept1settings.sizeHint', { size: 60 });
  };

  private getMaximumLubricationPerDays(
    days: number,
    items: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultItem<number> | undefined {
    const perDays = helpers.maximumRelubricationPerDays(days, items);

    if (!perDays) {
      return undefined;
    }

    return this.getLubricationItemPerNumberOfDays(days, items, rho, perDays);
  }

  private getAverageLubricationPerDays(
    days: number,
    items: GreaseReportSubordinateDataItem[],
    rho: number,
    tooltip?: string
  ): GreaseResultItem<number> | undefined {
    const perDays = helpers.relubricationPerDays(days, items);

    if (!perDays) {
      return undefined;
    }

    return this.getLubricationItemPerNumberOfDays(
      days,
      items,
      rho,
      perDays,
      tooltip
    );
  }

  private getLubricationItemPerNumberOfDays(
    numberOfDays: number,
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number,
    relubricationPerDays: number,
    tooltip?: string
  ): GreaseResultItem<number> | undefined {
    const relubricationPerDaysVolume = this.roundValue(relubricationPerDays);

    const relubricationPerDaysMass = this.calculateMass(
      rho,
      relubricationPerDays,
      `${numberOfDays} ${translate('calculationResult.days')}`
    );

    const result: GreaseResultItem<number> = {
      title: `relubricationPer${numberOfDays}days`,
      value: relubricationPerDaysMass.value,
      prefix: relubricationPerDaysMass.prefix,
      unit: relubricationPerDaysMass.unit,
      secondaryValue: relubricationPerDaysVolume.roundedValue,
      secondaryPrefix: relubricationPerDaysVolume.prefix,
      secondaryUnit: `${helpers.relubricationQuantityUnit(
        dataItems
      )}/${numberOfDays} ${translate('calculationResult.days')}`,
    };

    if (tooltip) {
      result.tooltip = tooltip;
    }

    return result;
  }

  private readonly get125mlHintNote = (
    c1_125: number | undefined,
    item: GreaseReportSubordinateDataItem[]
  ): string | undefined => {
    const note125mlOvergreased = '2';

    const overgreasingInfo = this.isOvergreased(item, note125mlOvergreased)
      ? translate('calculationResult.concept1settings.size125PossibleHint')
      : undefined;

    return c1_125
      ? overgreasingInfo
      : translate('calculationResult.concept1settings.sizeHint', { size: 125 });
  };

  private readonly isOvergreased = (
    item: GreaseReportSubordinateDataItem[],
    searchedNotesNumber: string
  ): boolean => {
    let notes = helpers.itemValue(item, SubordinateDataItemField.NOTE);

    if (!notes) {
      // remove once api will fix response, as on the current state for some of the languages response key is translated.
      const notesIndexArray = 6;
      notes = helpers.itemValue(item, undefined, notesIndexArray);
    }

    return notes.toString().includes(searchedNotesNumber);
  };
}
