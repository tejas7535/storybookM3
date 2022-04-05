import { ColumnFields } from '../../../shared/ag-grid/constants/column-fields.enum';
import { Quotation } from '../../../shared/models';

export class TableContext {
  quotation: Quotation;
  onMultipleMaterialSimulation?: (valueId: ColumnFields, value: number) => void;
}
