import { FormControl, FormGroup } from '@angular/forms';

import { Accessory } from '@lsa/shared/models';

export type TableItem = Accessory;

export interface CartSummary {
  totalNetPrice?: number;
  totalPieceCount?: number;
}

export interface AccessoryTableGroup {
  groupTitle: string;
  items: TableItem[];
}

export interface AccessoryTable {
  [key: string]: AccessoryTableGroup;
}

export interface TableGroupState {
  isOpen: boolean;
  totalQty: number;
  totalNetPrice?: number;
}

export type AccessoryTableFormGroup = FormGroup<{
  [key: string]: FormGroup<{ [key: string]: FormControl<number> }>;
}>;
