/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { CalculationParametersService } from '../../calculation-parameters/services';
import * as helpers from '../helpers/grease-helpers';
import {
  CONCEPT1,
  GreaseConcep1Suitablity,
  GreaseReportConcept1Subordinate,
  GreaseReportSubordinateDataItem,
  GreaseReportSubordinateTitle,
  GreaseResultDataSourceItem,
  SubordinateDataItemField,
  SUITABILITY,
} from '../models';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';

@Injectable()
export class GreaseResultDataSourceService {
  private readonly tinyNumberFormatOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
  };

  private readonly daysInYear = 365;

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
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              initialGreaseQuantityValue,
              'decimal'
            )} ${helpers.itemUnit(dataItems, SubordinateDataItemField.QVIN)}`
          )}`,
        }
      : undefined;
  }

  public relubricationQuantityPer1000OperatingHours(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const numberOfHours = 1000;
    const relubricationQuantityPerOperatingHours =
      helpers.relubricationPerOperatingHours(numberOfHours, dataItems);

    return relubricationQuantityPerOperatingHours
      ? {
          title: 'relubricationQuantityPer1000OperatingHours',
          values: `${this.massTemplate(
            rho,
            relubricationQuantityPerOperatingHours,
            translate('calculationResult.hours', { hours: numberOfHours })
          )}<br>${helpers.secondaryValue(
            `${this.localeService.localizeNumber(
              relubricationQuantityPerOperatingHours,
              'decimal'
            )} ${helpers.relubricationQuantityUnit(dataItems)}/${translate(
              'calculationResult.hours',
              { hours: numberOfHours }
            )}`
          )}`,
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

  public maximumManualRelubricationInterval(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const relubricationIntervalValueInDays =
      helpers.relubricationIntervalInDays(dataItems);

    const numberOfDays =
      relubricationIntervalValueInDays > this.daysInYear
        ? this.daysInYear
        : relubricationIntervalValueInDays;

    /*
      Qvre_man_min and Qvre_man_max are not used in the calculation as it is combined value per interval,
      so for an example if the result of relubricationIntervalInDays is 870 days then the unit of value is cm³/870 days,
      which is not suitable for the scenario where we exceed 365 days.
      the outcome of the calculation should equal to average of Qvre_man_min and Qvre_man_max , if the interval is less than 365 days. 

      Qvre_aut_min and Qvre_aut_max are defined as per day values which are easier used in the calculation.
    */
    const relubricationPerDays = helpers.relubricationPerDays(
      numberOfDays,
      dataItems
    );

    if (!relubricationPerDays) {
      return undefined;
    }

    const result: GreaseResultDataSourceItem = {
      title: `maximumManualRelubricationPerInterval`,
      values: `${this.massTemplate(
        rho,
        relubricationPerDays,
        `${numberOfDays} ${translate('calculationResult.days')}`
      )}<br>${helpers.secondaryValue(
        `${this.localeService.localizeNumber(
          relubricationPerDays,
          'decimal'
        )} ${helpers.relubricationQuantityUnit(
          dataItems
        )}/${numberOfDays} ${translate('calculationResult.days')}`
      )}`,
    };

    return result;
  }

  public relubricationInterval(dataItems: GreaseReportSubordinateDataItem[]) {
    const relubricationIntervalValue =
      helpers.relubricationIntervalInDays(dataItems);

    return relubricationIntervalValue
      ? {
          title: 'relubricationInterval',
          values: `~ ${relubricationIntervalValue} ${translate('calculationResult.days')}`,
          tooltip: 'relubricationIntervalTooltip',
        }
      : undefined;
  }

  public relubricationPer7Days(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    return this.getLubricationPerNumberOfDays(7, dataItems, rho);
  }

  public relubricationPer30Days(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    return this.getLubricationPerNumberOfDays(30, dataItems, rho);
  }

  public relubricationPer365Days(
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number
  ): GreaseResultDataSourceItem {
    const tooltip = 'relubricationQuantityPer365daysTooltip';

    return this.getLubricationPerNumberOfDays(365, dataItems, rho, tooltip);
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
    rho: number,
    quantity: number,
    timespan?: string,
    tiny = false
  ): string => {
    const value =
      (rho || this.calculationParametersService.getDensity()) * quantity;

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

  private getLubricationPerNumberOfDays(
    numberOfDays: number,
    dataItems: GreaseReportSubordinateDataItem[],
    rho: number,
    tooltip?: string
  ): GreaseResultDataSourceItem | undefined {
    const relubricationPerDays = helpers.relubricationPerDays(
      numberOfDays,
      dataItems
    );

    if (!relubricationPerDays) {
      return undefined;
    }

    const result: GreaseResultDataSourceItem = {
      title: `relubricationPer${numberOfDays}days`,
      values: `${this.massTemplate(
        rho,
        relubricationPerDays,
        `${numberOfDays} ${translate('calculationResult.days')}`
      )}<br>${helpers.secondaryValue(
        `${this.localeService.localizeNumber(
          relubricationPerDays,
          'decimal'
        )} ${helpers.relubricationQuantityUnit(
          dataItems
        )}/${numberOfDays} ${translate('calculationResult.days')}`
      )}`,
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
