import { formatNumber } from '@angular/common';

import { ValueFormatterParams } from 'ag-grid-community';

import { SAPMaterial } from '@mac/feature/materials-supplier-database/models';

export const EMISSION_FACTORS_FORMATTER = ({
  value,
}: ValueFormatterParams<SAPMaterial, number>) => {
  let formattedValue: string;

  if (value) {
    const formatNumberResult = formatNumber(value, 'en-US', '1.0-3');
    formattedValue =
      // If the value is very small, e.g. 0.0004, formatNumber returns '0'
      value > 0 && formatNumberResult === '0' ? '< 0.001' : formatNumberResult;
  }

  return formattedValue;
};
