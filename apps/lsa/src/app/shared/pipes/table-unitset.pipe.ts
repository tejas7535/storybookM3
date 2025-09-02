import { Pipe, PipeTransform } from '@angular/core';

import { MultiUnitValue, RecommendationTableData } from '../models';
import { Unitset } from '../models/preferences.model';

@Pipe({
  name: 'lsaUnitsetTable',
})
export class TableUnitsetPipe implements PipeTransform {
  transform(
    value: RecommendationTableData,
    unitset: Unitset
  ): RecommendationTableData {
    const pickValueClosure = (val: string | MultiUnitValue) => {
      if (typeof val === 'object') {
        return val[unitset === Unitset.SI ? 'SI' : 'FPS'];
      }

      return val;
    };

    const isConverted = (val: string | MultiUnitValue) =>
      typeof val === 'object' && unitset !== Unitset.SI;

    return {
      ...value,
      rows: value?.rows?.map((v) => ({
        ...v,
        converted: isConverted(v.minimum) || isConverted(v.recommended), // Important, this line is positional and must be called first
        minimum: pickValueClosure(v.minimum),
        recommended: pickValueClosure(v.recommended),
      })),
    };
  }
}
