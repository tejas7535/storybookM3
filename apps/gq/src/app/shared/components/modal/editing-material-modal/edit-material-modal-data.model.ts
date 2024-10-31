import { MaterialColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { MaterialTableItem } from '@gq/shared/models/table/material-table-item-model';

export interface EditMaterialModalData {
  material: MaterialTableItem;
  field: MaterialColumnFields;
  isCaseView: boolean;
}
