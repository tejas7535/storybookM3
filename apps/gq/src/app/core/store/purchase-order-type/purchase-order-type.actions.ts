import { PurchaseOrderType } from '@gq/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const PurchaseOrderTypeActions = createActionGroup({
  source: 'Purchase Order Type',
  events: {
    'get all purchase order types': emptyProps(),
    'get all purchase order types success': props<{
      purchaseOrderTypes: PurchaseOrderType[];
    }>(),
    'get all purchase order types failure': props<{ errorMessage: string }>(),
  },
});
