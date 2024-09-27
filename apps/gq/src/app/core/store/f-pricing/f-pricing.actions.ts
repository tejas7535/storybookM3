import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import { ProductType } from '@gq/shared/models';
import {
  FPricingData,
  UpdateFPricingDataResponse,
} from '@gq/shared/models/f-pricing';
import { MaterialComparisonResponse } from '@gq/shared/models/f-pricing/material-comparison.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { FPricingComparableMaterials } from '../transactions/models/f-pricing-comparable-materials.interface';
import { FPricingCalculations } from './models/f-pricing-calculations.interface';

export const FPricingActions = createActionGroup({
  source: 'fPricing',
  events: {
    'Reset FPricing Data': emptyProps(),
    'Load FPricing Data': props<{ gqPositionId: string }>(),
    'Load FPricing Data Success': props<{ data: FPricingData }>(),
    'Load FPricing Data failure': props<{ error: Error }>(),

    // data is fetched within the effect
    'Trigger FPricing Calculations': emptyProps(),
    'Trigger FPricing Calculations Success': props<{
      response: FPricingCalculations;
    }>(),
    'Trigger FPricing Calculations Failure': props<{
      error: Error;
    }>(),

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

    'Update Manual Price': props<{ gqPositionId: string; comment: string }>(),

    'Get Comparison Material Information': props<{
      referenceMaterialProductType: ProductType;
      referenceMaterial: string;
      materialToCompare: string;
    }>(),
    'Get Comparison Material Information Success': props<{
      response: MaterialComparisonResponse;
    }>(),
    'Get Comparison Material Information Failure': props<{ error: Error }>(),
  },
});
