/* eslint-disable max-lines */

import { getQuotationDetails } from '@gq/core/store/active-case/active-case.selectors';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { MarketValueDriverDisplayItem } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import { Keyboard, QuotationDetail } from '@gq/shared/models';
import {
  FPricingCalculationsRequest,
  FPricingCalculationsResponse,
  FPricingData,
  MarketValueDriver,
  MaterialInformation,
  PropertyValue,
  UpdateFPricingDataRequest,
} from '@gq/shared/models/f-pricing';
import {
  MaterialComparison,
  MaterialComparisonInformation,
} from '@gq/shared/models/f-pricing/material-comparison.interface';
import { SanityCheckMargins } from '@gq/shared/models/f-pricing/sanity-check-margins.interface';
import { TechnicalValueDriver } from '@gq/shared/models/f-pricing/technical-value-driver.interface';
import { addNumbers } from '@gq/shared/utils/f-pricing.utils';
import { translate } from '@jsverse/transloco';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import {
  ComparableMaterialsRowData,
  FPricingComparableMaterials,
} from '../transactions/models/f-pricing-comparable-materials.interface';
import { FPricingActions } from './f-pricing.actions';
import { FPricingCalculations } from './models/f-pricing-calculations.interface';
import { MarketValueDriverWarningLevel } from './models/market-value-driver-warning-level.enum';
import { MaterialInformationExtended } from './models/material-information-extended.interface';
import { PropertyDelta } from './models/property-delta.interface';

const TRANSLATION_KEY = 'fPricing.pricingAssistantModal';

const TECHNICAL_VALUE_DRIVERS = 'technicalValueDrivers.tableRows';
const SANITY_CHECKS = 'sanityChecks.tableRows';
const PRECISION = 2;

export interface FPricingState extends FPricingData {
  fPricingDataLoading: boolean;
  comparableTransactionsLoading: boolean;
  fPricingCalculationsLoading: boolean;
  materialComparisonLoading: boolean;
  error: Error;
  materialComparisonInformation: MaterialComparisonInformation;
  comparableTransactions: FPricingComparableMaterials[];
  marketValueDriversSelections: MarketValueDriverSelection[];
  technicalValueDriversToUpdate: TableItem[];
  manualPrice: number;
  calculations: FPricingCalculations;
}

export const initialState: FPricingState = {
  fPricingDataLoading: false,
  comparableTransactionsLoading: false,
  fPricingCalculationsLoading: false,
  materialComparisonLoading: false,
  error: null,
  materialComparisonInformation: null,
  gqPositionId: null,
  productType: null,
  referencePrice: null,
  comparableTransactions: null,
  marketValueDrivers: null,
  marketValueDriversSelections: [],
  manualPrice: null,
  technicalValueDrivers: null,
  technicalValueDriversToUpdate: [],
  sanityCheckMargins: null,
  calculations: null,
};

export const F_PRICING_KEY = 'fPricing';

export const fPricingFeature = createFeature({
  name: F_PRICING_KEY,
  reducer: createReducer(
    initialState,
    on(
      FPricingActions.resetFPricingData,
      (): FPricingState => ({
        ...initialState,
      })
    ),
    on(
      FPricingActions.loadFPricingData,
      (state: FPricingState): FPricingState => ({
        ...state,
        fPricingDataLoading: true,
      })
    ),
    on(
      FPricingActions.loadFPricingDataSuccess,
      (state: FPricingState, { data }): FPricingState => ({
        ...state,
        ...data,
        marketValueDriversSelections: data?.marketValueDrivers.map(
          (value) =>
            ({
              questionId: value.questionId,
              selectedOptionId: value.selectedOptionId,
              surcharge: value.options.find(
                (option) => option.optionId === value.selectedOptionId
              ).surcharge,
            }) as MarketValueDriverSelection
        ),
        fPricingDataLoading: false,
      })
    ),
    on(
      FPricingActions.loadFPricingDataFailure,
      (state: FPricingState, { error }): FPricingState => ({
        ...state,
        fPricingDataLoading: false,
        error,
      })
    ),
    on(
      FPricingActions.loadComparableTransactions,
      (state: FPricingState): FPricingState => ({
        ...state,
        comparableTransactionsLoading: true,
      })
    ),
    on(
      FPricingActions.loadComparableTransactionsSuccess,
      (state: FPricingState, { data }): FPricingState => ({
        ...state,
        comparableTransactionsLoading: false,
        comparableTransactions: data,
      })
    ),
    on(
      FPricingActions.loadComparableTransactionsFailure,
      (state: FPricingState, { error }): FPricingState => ({
        ...state,
        comparableTransactionsLoading: false,
        error,
      })
    ),
    on(
      FPricingActions.updateFPricing,
      (state: FPricingState): FPricingState => ({
        ...state,
        fPricingDataLoading: true,
      })
    ),
    on(
      FPricingActions.updateFPricingSuccess,
      (state: FPricingState, { response }): FPricingState => ({
        ...state,
        fPricingDataLoading: false,
        marketValueDriversSelections: response.marketValueDriverSelections,
        calculations: {
          ...state.calculations,
          finalPrice: response.finalPrice,
        },
      })
    ),
    on(
      FPricingActions.updateFPricingFailure,
      (state: FPricingState, { error }): FPricingState => ({
        ...state,
        fPricingDataLoading: false,
        error,
      })
    ),
    on(
      FPricingActions.setMarketValueDriverSelection,
      (state: FPricingState, { selection }): FPricingState => ({
        ...state,
        marketValueDriversSelections: [
          ...state.marketValueDriversSelections.filter(
            (element) => element.questionId !== selection.questionId
          ),
          selection,
        ],
      })
    ),
    on(
      FPricingActions.changePrice,
      (state: FPricingState, { price }): FPricingState => ({
        ...state,
        manualPrice: price,
      })
    ),

    on(
      FPricingActions.updateTechnicalValueDriver,
      (state: FPricingState, { technicalValueDriver }): FPricingState => ({
        ...state,
        technicalValueDriversToUpdate: [
          ...state.technicalValueDriversToUpdate.filter(
            (item) => item.id !== technicalValueDriver.id
          ),
          technicalValueDriver,
        ],
      })
    ),
    on(
      FPricingActions.triggerFPricingCalculations,
      (state: FPricingState): FPricingState => ({
        ...state,
        fPricingCalculationsLoading: true,
      })
    ),
    on(
      FPricingActions.triggerFPricingCalculationsSuccess,
      (state: FPricingState, { response }): FPricingState => ({
        ...state,
        fPricingCalculationsLoading: false,
        calculations: response,
      })
    ),
    on(
      FPricingActions.triggerFPricingCalculationsFailure,
      (state: FPricingState, { error }): FPricingState => ({
        ...state,
        fPricingCalculationsLoading: false,
        error,
      })
    ),
    on(
      FPricingActions.getComparisonMaterialInformation,
      (
        state: FPricingState,
        { referenceMaterialProductType, referenceMaterial, materialToCompare }
      ): FPricingState => ({
        ...state,
        productType: referenceMaterialProductType,
        materialComparisonLoading: true,
        materialComparisonInformation: {
          referenceMaterial,
          materialToCompare,
          materials: null,
        },
      })
    ),
    on(
      FPricingActions.getComparisonMaterialInformationSuccess,
      (state: FPricingState, { response }): FPricingState => ({
        ...state,
        materialComparisonLoading: false,
        materialComparisonInformation: {
          ...state.materialComparisonInformation,
          materials: [...response.items],
        },
      })
    ),
    on(
      FPricingActions.getComparisonMaterialInformationFailure,
      (state: FPricingState, { error }): FPricingState => ({
        ...state,
        materialComparisonLoading: false,
        error,
      })
    )
  ),

  extraSelectors: ({
    selectMaterialComparisonInformation,
    selectMarketValueDrivers,
    selectComparableTransactions,
    selectMarketValueDriversSelections,
    selectTechnicalValueDrivers,
    selectTechnicalValueDriversToUpdate,
    selectReferencePrice,
    selectCalculations,
    selectSanityCheckMargins,
    selectGqPositionId,
  }) => {
    const getConvertedMaterialInformation = createSelector(
      selectMaterialComparisonInformation,
      (
        materialComparisonInformation: MaterialComparisonInformation
      ): MaterialInformation[] => {
        if (!materialComparisonInformation.materials) {
          return [];
        }

        const referenceMaterial =
          materialComparisonInformation.referenceMaterial;
        // Make sure the reference material is always the first element in the array
        // eslint-disable-next-line no-param-reassign
        const materialComparisonInformationArray = [
          materialComparisonInformation.materials.find(
            (item) => item.materialNumber13 === referenceMaterial
          ),
          ...materialComparisonInformation.materials.filter(
            (item) => item.materialNumber13 !== referenceMaterial
          ),
        ];

        // 1. Build MaterialInformation structure based on the response
        // Get first element just to build the structure
        const firstElement = materialComparisonInformationArray[0];
        const objKeys = Object.keys(firstElement);
        const materialInformationArray: MaterialInformation[] = [];

        objKeys.forEach((informationKey) => {
          if (informationKey !== 'materialNumber13') {
            const materialInformation: MaterialInformation = {
              informationKey,
              properties: [],
            };

            const properties = Object.keys(
              firstElement[informationKey as keyof MaterialComparison]
            );

            properties.forEach((property) => {
              materialInformation.properties.push({
                key: property,
                values: [],
              });
            });

            materialInformationArray.push(materialInformation);
          }
        });

        // 2. Populate the material information structure with value pairs
        for (const value of materialComparisonInformationArray) {
          materialInformationArray.forEach((element) => {
            element.properties.forEach((property) => {
              const propValue: string | number =
                value[element.informationKey][property.key];

              property.values.push({
                materialNumber13: +value.materialNumber13,
                value: propValue,
              });
            });
          });
        }

        return materialInformationArray;
      }
    );
    const getMaterialInformationExtended = createSelector(
      getConvertedMaterialInformation,
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
    );
    const getComparableTransactionsForDisplaying = createSelector(
      selectComparableTransactions,
      (
        comparableTransactions: FPricingComparableMaterials[]
      ): ComparableMaterialsRowData[] => {
        const displayComparableTransactions: ComparableMaterialsRowData[] = [];
        let count = 1;
        comparableTransactions?.map((item) => {
          item.transactions.map((transaction) => {
            const displayItem: ComparableMaterialsRowData = {
              ...transaction,
              // eslint-disable-next-line no-plusplus
              identifier: count++,
              parentMaterialDescription: item.material.materialDescription,
              parentMaterialNumber: item.material.materialNumber,
            };
            displayComparableTransactions.push(displayItem);
          });
        });

        return displayComparableTransactions;
      }
    );
    const getComparableTransactionsAvailable = createSelector(
      getComparableTransactionsForDisplaying,
      (comparableTransactions: ComparableMaterialsRowData[]): boolean =>
        comparableTransactions?.length > 0
    );
    const getMarketValueDriverForDisplay = createSelector(
      selectMarketValueDrivers,
      selectMarketValueDriversSelections,
      (
        marketValueDriver: MarketValueDriver[],
        marketValueDriverSelection: MarketValueDriverSelection[]
      ): MarketValueDriverDisplayItem[] => {
        if (!marketValueDriver || !marketValueDriverSelection) {
          return [];
        }

        return marketValueDriver.map((item) => {
          const selection = marketValueDriverSelection.find(
            (mvdSelection) => mvdSelection.questionId === item.questionId
          );
          const displayItem: MarketValueDriverDisplayItem = {
            questionId: item.questionId,
            options: item.options.map((option) => ({
              optionId: option.optionId,
              selected: selection?.selectedOptionId === option.optionId,
              surcharge: option.surcharge,
            })),
          };

          return displayItem;
        });
      }
    );
    const getAnyMarketValueDriverSelected = createSelector(
      selectMarketValueDrivers,
      selectMarketValueDriversSelections,
      (
        marketValueDrivers: MarketValueDriver[],
        selections: MarketValueDriverSelection[]
      ): boolean =>
        selections?.some((item) =>
          notLastOptionSelected(marketValueDrivers, item)
        )
    );
    // check if all the selections are made and not the last option
    const getAllMarketValueDriverSelected = createSelector(
      selectMarketValueDrivers,
      selectMarketValueDriversSelections,
      (
        marketValueDrivers: MarketValueDriver[],
        selections: MarketValueDriverSelection[]
      ): boolean =>
        selections?.every((item) =>
          notLastOptionSelected(marketValueDrivers, item)
        )
    );

    const getMarketValueDriverWarningLevel = createSelector(
      getAnyMarketValueDriverSelected,
      getAllMarketValueDriverSelected,

      (some: boolean, all: boolean): MarketValueDriverWarningLevel => {
        if (all) {
          return MarketValueDriverWarningLevel.COMPLETE;
        }
        if (some) {
          return MarketValueDriverWarningLevel.INCOMPLETE;
        }

        return MarketValueDriverWarningLevel.UNSET;
      }
    );

    const getTechnicalValueDriversForDisplay = createSelector(
      selectTechnicalValueDrivers,
      selectTechnicalValueDriversToUpdate,
      (
        technicalValueDriver: TechnicalValueDriver,
        technicalValueDriverUpdated: TableItem[]
      ): TableItem[] => {
        if (!technicalValueDriver) {
          return [];
        }
        // the Values of the items will be mapped within the facade to have access to localization Service
        const list = [
          {
            id: 1,
            description: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.heatTreatment`
            ),

            value: technicalValueDriver?.heatTreatmentSurcharge,
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 1
            )?.editableValue,
            additionalDescription: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.heatTreatmentDescription`,
              {
                value:
                  technicalValueDriver?.topHeatTreatmentValue ?? Keyboard.DASH,
              }
            ),
          },
          {
            id: 2,
            description: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.toleranceClass`
            ),
            value: technicalValueDriver?.toleranceClassSurcharge,
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 2
            )?.editableValue,
            additionalDescription: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.toleranceClassDescription`,
              {
                value:
                  technicalValueDriver?.topToleranceClassValue ?? Keyboard.DASH,
              }
            ),
          },
          {
            id: 3,
            description: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.radialClearance`
            ),
            value: technicalValueDriver?.clearanceRadialSurcharge,
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 3
            )?.editableValue,
            additionalDescription: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.radialClearanceDescription`
            ),
          },
          {
            id: 4,
            description: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.axialClearance`
            ),
            value: technicalValueDriver?.clearanceAxialSurcharge,
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 4
            )?.editableValue,
            additionalDescription: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.axialClearanceDescription`,
              { value: technicalValueDriver?.clearanceAxial ?? Keyboard.DASH }
            ),
          },
          {
            id: 5,
            description: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.engineeringEffort`
            ),
            value: technicalValueDriver?.engineeringEffortSurcharge,
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 5
            )?.editableValue,
            additionalDescription: translate(
              `${TRANSLATION_KEY}.${TECHNICAL_VALUE_DRIVERS}.engineeringEffortDescription`
            ),
          },
        ];

        return list;
      }
    );

    /* Result of this selector is the sum of all surcharges from selected market value drivers */
    const getMarketValueDriversRelativeValue = createSelector(
      selectMarketValueDriversSelections,
      (marketValueDriversSelections): number => {
        if (!marketValueDriversSelections) {
          return 0;
        }

        return addNumbers(
          marketValueDriversSelections.map((option) => option.surcharge),
          PRECISION
        );
      }
    );

    const getReferencePriceRounded = createSelector(
      selectReferencePrice,
      (referencePrice): number => Number((referencePrice ?? 0).toFixed(2))
    );

    const getTechnicalValueDriversRelativeValue = createSelector(
      selectTechnicalValueDrivers,
      (tvd: TechnicalValueDriver): number =>
        addNumbers(
          [
            tvd?.heatTreatmentSurcharge,
            tvd?.toleranceClassSurcharge,
            tvd?.clearanceRadialSurcharge,
            tvd?.clearanceAxialSurcharge,
            tvd?.engineeringEffortSurcharge,
          ],
          PRECISION
        )
    );

    const getSanityChecksForDisplay = createSelector(
      selectCalculations,
      (calculations: FPricingCalculations): TableItem[] => {
        // the Values of the items will be mapped within the facade to have access to localization Service
        if (!calculations) {
          return [];
        }
        const sanityCheckList: TableItem[] = [
          {
            id: 1,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.priceRecommendationBefore`
            ),
            value: calculations.sanityCheck.priceBeforeSanityCheck,
          },
          {
            id: 2,
            description: translate(`${TRANSLATION_KEY}.${SANITY_CHECKS}.cost`),
            value: calculations.sanityCheck.sqv,
          },
          {
            id: 3,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.lowerThreshold`
            ),
            value: calculations.sanityCheck.minPriceOnSqv,
          },
          {
            id: 4,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.lastCustomerPrice`
            ),
            value: calculations.sanityCheck.lastCustomerPrice,
          },
          {
            id: 5,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.upperThreshold`
            ),
            value: calculations.sanityCheck.maxPrice,
          },
          {
            id: 6,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.priceRecommendationAfter`
            ),
            value: calculations.sanityCheck.priceAfterSanityCheck,
          },
        ];

        return sanityCheckList;
      }
    );

    const getFinalPrice = createSelector(
      selectCalculations,
      (calculations: FPricingCalculationsResponse): number =>
        calculations?.finalPrice
    );

    const getDataForUpdateFPricing = createSelector(
      selectMarketValueDriversSelections,
      getFinalPrice,
      (marketValueDriverSelections, finalPrice): UpdateFPricingDataRequest => ({
        marketValueDriverSelections,
        finalPrice,
      })
    );

    const getDataForTriggerCalculations = createSelector(
      selectReferencePrice,
      getTechnicalValueDriversRelativeValue,
      getMarketValueDriversRelativeValue,
      selectSanityCheckMargins,
      selectGqPositionId,
      getQuotationDetails,
      (
        referencePrice: number,
        relativeTvdSurcharge: number,
        relativeMvdSurcharge: number,
        sanityCheckMargins: SanityCheckMargins,
        gqPositionId: string,
        quotationDetails: QuotationDetail[]
      ): FPricingCalculationsRequest => {
        const quotationDetail = quotationDetails.find(
          (item) => item.gqPositionId === gqPositionId
        );

        return {
          referencePrice,
          relativeTvdSurcharge,
          relativeMvdSurcharge,
          sanityCheck: {
            minMargin: sanityCheckMargins.minMargin,
            maxMargin: sanityCheckMargins.maxMargin,
            // when sqv of RFQ ist not available take the quotationDetail.sqv
            sqv: quotationDetail?.rfqData?.sqv ?? quotationDetail?.sqv,
            lastCustomerPrice: quotationDetail?.lastCustomerPrice,
          },
        };
      }
    );

    return {
      getMaterialInformationExtended,
      getComparableTransactionsForDisplaying,
      getComparableTransactionsAvailable,
      getMarketValueDriverForDisplay,
      getAnyMarketValueDriverSelected,
      getAllMarketValueDriverSelected,
      getMarketValueDriverWarningLevel,
      getTechnicalValueDriversForDisplay,
      getReferencePriceRounded,
      getMarketValueDriversRelativeValue,
      getTechnicalValueDriversRelativeValue,
      getSanityChecksForDisplay,
      getDataForUpdateFPricing,
      getDataForTriggerCalculations,
      getFinalPrice,
      getConvertedMaterialInformation,
    };
  },
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
 * Checks if other than the last option in selected for given MVD.
 * @param marketValueDrivers the market value drivers
 * @param selection the market value driver selection
 * @returns is last option not selected
 */
export function notLastOptionSelected(
  marketValueDrivers: MarketValueDriver[],
  selection: MarketValueDriverSelection
) {
  const found = marketValueDrivers.find(
    (mvd) => mvd.questionId === selection.questionId
  );

  return selection.selectedOptionId !== found?.options.length;
}

/**
 * Will return the recommended Price after sanity checks.
 *
 * @param recPriceBeforeCheck the price recommendation before sanity checks
 * @param minThreshold minimum allowed value according to sanity checks
 * @param maxThreshold maximum allowed value according to sanity checks
 * @param lastCustomerPrice the last customer price, acts as minimum value if higher than min value from sanity checks
 * @returns the price recommendation after sanity checks
 */
export function calculatePriceRecommendationAfterSanityChecks(
  recPriceBeforeCheck: number,
  minThreshold: number,
  maxThreshold: number,
  lastCustomerPrice: number
): number {
  // if the last customer price is higher than the min threshold, the lastCustomerPrice is the new min value
  const minValue =
    lastCustomerPrice != null && lastCustomerPrice > minThreshold
      ? lastCustomerPrice
      : minThreshold;

  if (recPriceBeforeCheck < minValue) {
    return minValue;
  }
  if (recPriceBeforeCheck > maxThreshold) {
    return maxThreshold;
  }

  return recPriceBeforeCheck;
}

/**
 * Checks if a delta exists for the given property values.
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
    // todo: Consider delta creation on BE to avoid rounding issues
    delta.absolute = Number((values[1].value - values[0].value).toFixed(2));
    delta.relative = Number(
      ((delta.absolute / values[0].value) * 100).toFixed(2)
    );
  }

  return delta;
}
