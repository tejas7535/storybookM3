import { MaterialTableItem, MaterialValidation } from '@gq/shared/models/table';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ProcessCaseActions = createActionGroup({
  source: 'Process Case',
  events: {
    'Clear Row Data': emptyProps(),
    'Add New Items To Material Table': props<{ items: MaterialTableItem[] }>(),
    'Duplicate Item From Material Table': props<{ itemId: number }>(),
    'Update Item From Material Table': props<{
      item: MaterialTableItem;
      revalidate: boolean;
    }>(),
    'Delete Item From Material Table': props<{ id: number }>(),
    'Validate Material Table Items': emptyProps(),
    'Validate Material Table Items Failure': props<{ errorMessage: string }>(),
    'Validate Material Table Items Success': props<{
      materialValidations: MaterialValidation[];
    }>(),
  },
});
