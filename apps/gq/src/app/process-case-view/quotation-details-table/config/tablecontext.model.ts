import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { Quotation } from '@gq/shared/models';

export class TableContext {
  quotation: Quotation;
  onMultipleMaterialSimulation?: (
    valueId: ColumnFields,
    value: number,
    isInvalid: boolean
  ) => void;
  onPriceSourceSimulation?: (priceSourceOption: PriceSourceOptions) => void;
  simulatedField?: string;
  simulatedValue?: number;
}
