import { PriceSourceOptions } from '../../../shared/ag-grid/column-headers/editable-column-header/models/price-source-options.enum';
import { ColumnFields } from '../../../shared/ag-grid/constants/column-fields.enum';
import { Quotation } from '../../../shared/models';

export class TableContext {
  quotation: Quotation;
  onMultipleMaterialSimulation?: (valueId: ColumnFields, value: number) => void;
  onPriceSourceSimulation?: (priceSourceOption: PriceSourceOptions) => void;
}
