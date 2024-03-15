import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import {
  FPricingData,
  UpdateFPricingDataResponse,
} from '@gq/shared/models/f-pricing';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { FPricingComparableMaterials } from '../reducers/transactions/models/f-pricing-comparable-materials.interface';

export const FPricingActions = createActionGroup({
  source: 'fPricing',
  events: {
    'Reset FPricing Data': emptyProps(),
    'Load FPricing Data': props<{ gqPositionId: string }>(),
    'Load FPricing Data Success': props<{ data: FPricingData }>(),
    'Load FPricing Data failure': props<{ error: Error }>(),

    'Load Comparable Transactions': props<{ gqPositionId: string }>(),
    'Load Comparable Transactions Success': props<{
      data: FPricingComparableMaterials[];
    }>(),
    'Load Comparable Transactions Failure': props<{ error: Error }>(),

    'Update FPricing': props<{
      gqPositionId: string;
    }>(),
    'Update FPricing Success': props<{
      response: UpdateFPricingDataResponse;
    }>(),
    'Update FPricing Failure': props<{ error: Error }>(),

    'Set Market Value Driver Selection': props<{
      selection: MarketValueDriverSelection;
    }>(),

    'Change Price': props<{ price: number }>(),
    'Update Technical Value Driver': props<{
      technicalValueDriver: TableItem;
    }>(),

    'Set Sanity Check Value': props<{ value: number }>(),
  },
});
