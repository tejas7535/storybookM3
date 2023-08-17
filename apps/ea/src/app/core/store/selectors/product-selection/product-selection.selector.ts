import { createSelector } from '@ngrx/store';

import { getProductSelectionState } from '../../reducers';

export const getBearingDesignation = createSelector(
  getProductSelectionState,
  (state): string => state.bearingDesignation
);

export const getBearingId = createSelector(
  getProductSelectionState,
  (state): string => state.bearingId
);

export const getCalculationModuleInfo = createSelector(
  getProductSelectionState,
  (state) => state.calculationModuleInfo
);

export const getLoadcaseTemplate = createSelector(
  getProductSelectionState,
  (state) => state.loadcaseTemplate
);

export const getOperatingConditionsTemplate = createSelector(
  getProductSelectionState,
  (state) => state.operatingConditionsTemplate
);

export const getLoadCaseTemplateItem = (props: { itemId: string }) =>
  createSelector(getLoadcaseTemplate, (templates) =>
    templates?.find((template) => template.id === props.itemId)
  );

export const getOperatingConditionsTemplateItem = (props: { itemId: string }) =>
  createSelector(getOperatingConditionsTemplate, (templates) =>
    templates?.find((template) => template.id === props.itemId)
  );
