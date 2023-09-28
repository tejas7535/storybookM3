import { CatalogServiceProductClass } from '@ea/core/services/catalog.service.interface';
import { createAction, props } from '@ngrx/store';

import { ProductSelectionState } from '../../models/product-selection-state.model';

export const setBearingDesignation = createAction(
  '[Product Selection] Set Bearing Designation',
  props<{ bearingDesignation: string }>()
);

export const setBearingId = createAction(
  '[Product Selection] Set Bearing Id',
  props<{ bearingId: string }>()
);

export const setBearingProductClass = createAction(
  '[Product Selection] Set Bearing Product Class',
  props<{ productClass: CatalogServiceProductClass }>()
);

export const fetchCalculationModuleInfo = createAction(
  '[Product Selection] Fetch Calculation Module Info'
);

export const setCalculationModuleInfo = createAction(
  '[Product Selection] Set Calculation Module Info',
  props<{
    calculationModuleInfo: ProductSelectionState['calculationModuleInfo'];
  }>()
);

export const setProductFetchFailure = createAction(
  '[Product Selection] Set Product Fetch Failure',
  props<{ error: { catalogApi?: string; moduleInfoApi?: string } }>()
);

export const fetchLoadcaseTemplate = createAction(
  '[Product Selection] Fetch Loadcase Template'
);

export const setLoadcaseTemplate = createAction(
  '[Product Selection] Set Loadcase Template',
  props<{
    loadcaseTemplate: ProductSelectionState['loadcaseTemplate'];
  }>()
);

export const fetchOperatingConditionsTemplate = createAction(
  '[Product Selection] Fetch OperatingConditions Template'
);

export const setOperatingConditionsTemplate = createAction(
  '[Product Selection] Set OperatingConditions Template',
  props<{
    operatingConditionsTemplate: ProductSelectionState['operatingConditionsTemplate'];
  }>()
);

export const fetchBearingCapabilities = createAction(
  '[Product Selection] Fetch BearingCapabilities'
);
