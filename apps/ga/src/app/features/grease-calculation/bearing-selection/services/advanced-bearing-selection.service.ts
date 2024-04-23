import { Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';

import { RangeFilter } from '@ga/shared/components/range-filter';
import { bearingTypes } from '@ga/shared/constants';
import { AdvancedBearingSelectionFilters } from '@ga/shared/models';

@Injectable()
export class AdvancedBearingSelectionService {
  public bearingTypes = bearingTypes.map((bearingType) => ({
    ...bearingType,
    text: translate(`bearing.bearingTypes.${bearingType.id}`),
  }));

  public dimensionMinValue = 0;
  public dimensionMaxValue = 9999;

  public getBoreDiameterRangeFilter = (
    selectionFilters?: AdvancedBearingSelectionFilters
  ): RangeFilter => ({
    name: translate('bearing.label.boreDiameter'),
    label: translate('shared.label.defaultSet', {
      label: `${translate('bearing.label.boreDiameter')} (${translate(
        'bearing.label.boreDiameterShort'
      )})`,
    }),
    min: this.dimensionMinValue,
    max: this.dimensionMaxValue,
    unit: translate('shared.unit.millimeterShort'),
    minSelected: selectionFilters?.boreDiameterMin,
    maxSelected: selectionFilters?.boreDiameterMax,
  });

  public getOutsideDiameterRangeFilter = (
    selectionFilters?: AdvancedBearingSelectionFilters
  ): RangeFilter => ({
    name: translate('bearing.label.outsideDiameter'),
    label: translate('shared.label.defaultSet', {
      label: `${translate('bearing.label.outsideDiameter')} (${translate(
        'bearing.label.outsideDiameterShort'
      )})`,
    }),
    min: this.dimensionMinValue,
    max: this.dimensionMaxValue,
    unit: translate('shared.unit.millimeterShort'),
    minSelected: selectionFilters?.outsideDiameterMin,
    maxSelected: selectionFilters?.outsideDiameterMax,
  });

  public getWidthRangeFilter = (
    selectionFilters?: AdvancedBearingSelectionFilters
  ): RangeFilter => ({
    name: translate('bearing.label.width'),
    label: translate('shared.label.defaultSet', {
      label: `${translate('bearing.label.width')} (${translate(
        'bearing.label.widthShort'
      )})`,
    }),
    min: this.dimensionMinValue,
    max: this.dimensionMaxValue,
    unit: translate('shared.unit.millimeterShort'),
    minSelected: selectionFilters?.widthMin,
    maxSelected: selectionFilters?.widthMax,
  });
}
