import {
  MaterialInformation,
  PropertyValue,
} from '@gq/shared/models/f-pricing';
import { createFeature, createReducer, createSelector } from '@ngrx/store';

import { MATERIAL_INFORMATION_MOCK } from '../../../../testing/mocks';
import { MaterialInformationExtended } from './models/material-information-extended.interface';
import { PropertyDelta } from './models/property-delta.interface';
export interface FPricingState {
  materialInformation: MaterialInformation[];
}

export const initialState: FPricingState = {
  materialInformation: MATERIAL_INFORMATION_MOCK,
};

export const F_PRICING_KEY = 'FPricing';

export const fPricingFeature = createFeature({
  name: F_PRICING_KEY,
  reducer: createReducer(initialState),
  extraSelectors: ({ selectMaterialInformation }) => ({
    getMaterialInformationExtended: createSelector(
      selectMaterialInformation,
      (
        materialInformation: MaterialInformation[]
      ): MaterialInformationExtended[] => {
        const materialInformationDisplay: MaterialInformationExtended[] = [];
        materialInformation.map((item) => {
          const countOfDelta = getNumberOfDeltasByInformationKey(
            item.informationKey,
            materialInformation
          );

          const deltaValues: PropertyDelta[] = item.properties.map((property) =>
            getDeltaByInformationKeyAndPropertyKey(item, property.key)
          );
          const displayItem: MaterialInformationExtended = {
            ...item,
            countOfDelta,
            deltaValues,
          };

          materialInformationDisplay.push(displayItem);
        });

        return materialInformationDisplay;
      }
    ),
  }),
});

/**
 * Gets the number of deltas for the given information key.
 * @param key the information key
 * @param materialInformation the list of material information
 * @returns the number of deltas
 */
export function getNumberOfDeltasByInformationKey(
  key: string,
  materialInformation: MaterialInformation[]
): number {
  const materialInformationItem = materialInformation.find(
    (item) => item.informationKey === key
  );

  if (!materialInformationItem) {
    return 0;
  }

  return materialInformationItem.properties
    .map((property) => isDeltaByPropertyValue(property.values))
    .filter(Boolean).length;
}

/**
 * Get the delta for the given information key and property key.
 * @param materialInformation the list of material information
 * @param informationKey the information key
 * @param propertyKey   the property key
 * @returns the delta
 */
export function getDeltaByInformationKeyAndPropertyKey(
  materialInformation: MaterialInformation,
  propertyKey: string
): PropertyDelta | undefined {
  // get matching property values by keys
  const values = materialInformation?.properties.find(
    (item) => item.key === propertyKey
  )?.values;

  // no values to compare found
  if (!values || values.length !== 2) {
    return undefined;
  }

  return createDelta(values);
}

/**
 * Checks if a delta exists for the given property values.
 * @param propertyValues the property values to compare
 * @returns if a delta exists
 */
function isDeltaByPropertyValue(propertyValues: PropertyValue[]): boolean {
  // not exactly two values to compare
  if (propertyValues.length !== 2) {
    return false;
  }

  return propertyValues[0].value !== propertyValues[1].value;
}

/**
 * Creates a delta by comparing two property values.
 * @param values the property values to compare
 * @returns the delta
 */
function createDelta(values: PropertyValue[]): PropertyDelta {
  if (values.length !== 2) {
    return undefined;
  }

  const delta: PropertyDelta = {
    isDelta: values[0].value !== values[1].value,
  };

  if (
    typeof values[0].value === 'number' &&
    typeof values[1].value === 'number'
  ) {
    delta.absolute = values[1].value - values[0].value;
    delta.relative = Math.round((delta.absolute / values[0].value) * 100);
  }

  return delta;
}
