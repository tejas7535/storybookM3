import { ValueFormatterParams } from 'ag-grid-community';

import { SAPMaterial } from '@mac/feature/materials-supplier-database/models';

import { TRANSLATE_VALUE_FORMATTER_FACTORY } from './translate-value-formatter';

export const MATURITY_FORMATTER = (
  params: ValueFormatterParams<SAPMaterial, number>
) => {
  const formatter = TRANSLATE_VALUE_FORMATTER_FACTORY(
    'materialsSupplierDatabase.dataSource'
  );

  return `${formatter(params)} (${params.value})`;
};
