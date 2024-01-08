import { CatalogServiceOperatingConditions } from '@ea/core/services/catalog.service.interface';
import { SUPPORTED_PRODUCT_CLASSES } from '@ea/shared/constants/products';
import { createSelector } from '@ngrx/store';

import { getProductSelectionState } from '../../reducers';

export const getBearingDesignation = createSelector(
  getProductSelectionState,
  (state): string => state.bearingDesignation
);

export const getBearingProductClass = createSelector(
  getProductSelectionState,
  (state) => state.bearingProductClass
);

export const getProductFetchError = createSelector(
  getProductSelectionState,
  (state) => state.error
);

export const getCatalogFetchErrors = createSelector(
  getProductFetchError,
  (error) => error?.catalogApi
);

export const getModuleInfoFetchErrors = createSelector(
  getProductFetchError,
  (error) => error?.moduleInfoApi
);

export const isBearingSupported = createSelector(
  getProductSelectionState,
  getCatalogFetchErrors,
  (productState, error) => {
    if (
      !SUPPORTED_PRODUCT_CLASSES.includes(productState.bearingProductClass) &&
      !error &&
      !!productState.bearingProductClass
    ) {
      return false;
    }

    return true;
  }
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

export const getTemplateItem = (props: { itemId: string }) =>
  createSelector(
    getLoadcaseTemplate,
    getOperatingConditionsTemplate,
    (loadCaseTemplates, operatingConditionsTemplate) => {
      // return null if the templates have not been loaded so this case can be detected
      if (!loadCaseTemplates || !operatingConditionsTemplate) {
        // eslint-disable-next-line unicorn/no-null
        return null;
      }

      return [
        ...(loadCaseTemplates || []),
        ...(operatingConditionsTemplate || []),
      ].find((template) => template.id === props.itemId);
    }
  );

export const getAvailableLoads = createSelector(
  getTemplateItem({ itemId: 'IDSLC_RADIAL_LOAD' }),
  getTemplateItem({ itemId: 'IDSLC_AXIAL_LOAD' }),
  (radial, axial) =>
    !radial && !axial
      ? undefined
      : {
          radialLoad: !!radial?.visible,
          axialLoad: !!axial?.visible,
        }
);

export const getAvailableLubricationMethods = createSelector(
  getTemplateItem({ itemId: 'IDL_LUBRICATION_METHOD' }),
  (template) => {
    if (!template) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }

    const options = template.options as {
      value: CatalogServiceOperatingConditions['IDL_LUBRICATION_METHOD'];
    }[];

    return {
      grease: options.some(
        (option) => option.value === 'LB_GREASE_LUBRICATION'
      ),
      oilBath: options.some(
        (option) => option.value === 'LB_OIL_BATH_LUBRICATION'
      ),
      oilMist: options.some(
        (option) => option.value === 'LB_OIL_MIST_LUBRICATION'
      ),
      recirculatingOil: options.some(
        (option) => option.value === 'LB_RECIRCULATING_OIL_LUBRICATION'
      ),
    };
  }
);
