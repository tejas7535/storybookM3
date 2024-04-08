/* eslint-disable max-lines */

import { getQuotationDetails } from '@gq/core/store/active-case/active-case.selectors';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { MarketValueDriverDisplayItem } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import { Keyboard, QuotationDetail } from '@gq/shared/models';
import {
  FPricingData,
  MarketValueDriver,
  MaterialInformation,
  PropertyValue,
  UpdateFPricingDataRequest,
} from '@gq/shared/models/f-pricing';
import { SanityCheckMargins } from '@gq/shared/models/f-pricing/sanity-check-margins.interface';
import { TechnicalValueDriver } from '@gq/shared/models/f-pricing/technical-value-driver.interface';
import { translate } from '@ngneat/transloco';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { MATERIAL_INFORMATION_MOCK } from '../../../../testing/mocks';
import {
  ComparableMaterialsRowData,
  FPricingComparableMaterials,
} from '../reducers/transactions/models/f-pricing-comparable-materials.interface';
import { FPricingActions } from './f-pricing.actions';
import { MarketValueDriverWarningLevel } from './models/market-value-driver-warning-level.enum';
import { MaterialInformationExtended } from './models/material-information-extended.interface';
import { PropertyDelta } from './models/property-delta.interface';

const TRANSLATION_KEY = 'fPricing.pricingAssistantModal';

const TECHNICAL_VALUE_DRIVERS = 'technicalValueDrivers.tableRows';
const SANITY_CHECKS = 'sanityChecks.tableRows';

export interface FPricingState extends FPricingData {
  fPricingDataLoading: boolean;
  comparableTransactionsLoading: boolean;
  error: Error;
  materialInformation: MaterialInformation[];
  comparableTransactions: FPricingComparableMaterials[];
  marketValueDriversSelections: MarketValueDriverSelection[];
  technicalValueDriversToUpdate: TableItem[];
  sanityCheckValues: SanityCheckData;
  // the price could either be the GQPrice or the manual price
  priceSelected: number;
  finalPrice: number;
}

export const initialState: FPricingState = {
  fPricingDataLoading: false,
  comparableTransactionsLoading: false,
  error: null,
  materialInformation: MATERIAL_INFORMATION_MOCK,
  gqPositionId: null,
  productType: null,
  referencePrice: null,
  comparableTransactions: null,
  marketValueDrivers: null,
  marketValueDriversSelections: [],
  priceSelected: null,
  technicalValueDrivers: null,
  technicalValueDriversToUpdate: [],
  sanityCheckMargins: null,
  sanityCheckValues: null,
  // this is the value of either the GqPrice or Manual Price
  finalPrice: null,
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
        marketValueDriversSelections: response.marketValueDriverSelections,
        finalPrice: response.finalPrice,
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
        priceSelected: price,
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
      FPricingActions.setSanityCheckValues,
      (state: FPricingState, { value }): FPricingState => ({
        ...state,
        sanityCheckValues: value,
      })
    ),
    on(
      FPricingActions.setFinalPriceValue,
      (state: FPricingState, { value }): FPricingState => ({
        ...state,
        finalPrice: value,
      })
    )
  ),

  extraSelectors: ({
    selectMaterialInformation,
    selectMarketValueDrivers,
    selectComparableTransactions,
    selectMarketValueDriversSelections,
    selectPriceSelected,
    selectGqPositionId,
    selectTechnicalValueDrivers,
    selectTechnicalValueDriversToUpdate,
    selectSanityCheckMargins,
    selectReferencePrice,
    selectSanityCheckValues,
  }) => {
    const getMaterialInformationExtended = createSelector(
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
      (marketValueDriversSelections): number =>
        Number(
          marketValueDriversSelections
            .reduce((acc, option) => acc + option.surcharge, 0)
            .toFixed(8)
        )
    );

    const getMarketValueDriversAbsoluteValue = createSelector(
      getMarketValueDriversRelativeValue,
      selectReferencePrice,
      (marketValueDriversRelativeValue, referencePrice): number => {
        if (!referencePrice) {
          return 0;
        }

        return Number(
          (referencePrice * marketValueDriversRelativeValue).toFixed(8)
        );
      }
    );

    const getTechnicalValueDriversRelativeValue = createSelector(
      selectTechnicalValueDrivers,
      (tvd: TechnicalValueDriver): number =>
        Number(
          (
            tvd?.heatTreatmentSurcharge +
            tvd?.toleranceClassSurcharge +
            tvd?.clearanceRadialSurcharge +
            tvd?.clearanceAxialSurcharge +
            tvd?.engineeringEffortSurcharge
          ).toFixed(8)
        )
    );

    const getTechnicalValueDriversValueAbsoluteValue = createSelector(
      getTechnicalValueDriversRelativeValue,
      selectReferencePrice,
      (tvdRelativeValue, referencePrice): number => {
        if (!referencePrice) {
          return 0;
        }

        return Number((referencePrice * tvdRelativeValue).toFixed(8));
      }
    );

    const getSanityCheckData = createSelector(
      selectSanityCheckMargins,
      selectGqPositionId,
      getQuotationDetails,
      selectReferencePrice,
      getTechnicalValueDriversRelativeValue,
      getMarketValueDriversRelativeValue,
      (
        sanityChecks: SanityCheckMargins,
        positionId: string,
        quotationDetails: QuotationDetail[],
        refPrice: number,
        tvdValue: number,
        mvdValue: number
      ): SanityCheckData => {
        if (!positionId || !sanityChecks || !refPrice) {
          return null;
        }
        const quotationDetail = quotationDetails.find(
          (item) => item.gqPositionId === positionId
        );

        // when sqv of RFQ ist not available take the quotationDetail.sqv
        const sqv = quotationDetail?.rfqData?.sqv ?? quotationDetail?.sqv;
        // formula: refPrice * (1 + mvdValue + tvdValue)
        const recommendBeforeChecks = Number(
          (refPrice * (1 + mvdValue + tvdValue)).toFixed(8)
        );
        // formula: SQV_RFQ / (1- minMargin)
        const lowerThreshold = Number(
          (sqv / (1 - sanityChecks.minMargin)).toFixed(8)
        );
        // formula: SQV_RFQ / (1- maxMargin)
        const upperThreshold = Number(
          (sqv / (1 - sanityChecks.maxMargin)).toFixed(8)
        );

        const recommendAfterChecks =
          calculatePriceRecommendationAfterForSanityChecks(
            recommendBeforeChecks,
            lowerThreshold,
            upperThreshold,
            quotationDetail?.lastCustomerPrice
          );

        const sanityCheckValue = Number(
          (recommendAfterChecks - recommendBeforeChecks).toFixed(8)
        );

        return {
          recommendBeforeChecks,
          lowerThreshold,
          upperThreshold,
          recommendAfterChecks,
          sqv,
          lastCustomerPrice: quotationDetail?.lastCustomerPrice,
          sanityCheckValue,
        };
      }
    );

    const getSanityChecksForDisplay = createSelector(
      getSanityCheckData,
      (sanityCheckData: SanityCheckData): TableItem[] => {
        // the Values of the items will be mapped within the facade to have access to localization Service
        if (!sanityCheckData) {
          return [];
        }
        const sanityCheckList: TableItem[] = [
          {
            id: 1,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.priceRecommendationBefore`
            ),
            value: sanityCheckData.recommendBeforeChecks,
          },
          {
            id: 2,
            description: translate(`${TRANSLATION_KEY}.${SANITY_CHECKS}.cost`),
            value: sanityCheckData.sqv,
          },
          {
            id: 3,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.lowerThreshold`
            ),
            value: sanityCheckData.lowerThreshold,
          },
          {
            id: 4,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.lastCustomerPrice`
            ),
            value: sanityCheckData.lastCustomerPrice,
          },
          {
            id: 5,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.upperThreshold`
            ),
            value: sanityCheckData.upperThreshold,
          },
          {
            id: 6,
            description: translate(
              `${TRANSLATION_KEY}.${SANITY_CHECKS}.priceRecommendationAfter`
            ),
            value: sanityCheckData.recommendAfterChecks,
          },
        ];

        return sanityCheckList;
      }
    );

    const getFinalPrice = createSelector(
      selectReferencePrice,
      getMarketValueDriversAbsoluteValue,
      getTechnicalValueDriversValueAbsoluteValue,
      selectSanityCheckValues,
      (refPrice, mvd, tvd, sanityCheck) =>
        Number(
          (refPrice + mvd + tvd + sanityCheck?.sanityCheckValue).toFixed(8)
        )
    );

    const getGpmValue = createSelector(
      selectGqPositionId,
      getFinalPrice,
      getQuotationDetails,
      (gqPositionId, finalPrice, quotationDetails) => {
        const qd = quotationDetails.find(
          (detail) => detail.gqPositionId === gqPositionId
        );
        if (!qd || !finalPrice) {
          return null;
        }
        // If SQV RFQ is available use it for calculations. Otherwise use SQV value from quotation details
        const sqvValue = qd.rfqData?.sqv ?? qd.sqv;
        if (!sqvValue) {
          return null;
        }

        return Number(((finalPrice - sqvValue) / finalPrice).toFixed(8)) * 100;
      }
    );

    const getDataForUpdateFPricing = createSelector(
      selectMarketValueDriversSelections,
      selectPriceSelected,
      getFinalPrice,
      (
        marketValueDriverSelections,
        selectedPrice,
        finalPrice
      ): UpdateFPricingDataRequest => ({
        marketValueDriverSelections,
        selectedPrice,
        finalPrice,
      })
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
      getMarketValueDriversRelativeValue,
      getMarketValueDriversAbsoluteValue,
      getTechnicalValueDriversRelativeValue,
      getTechnicalValueDriversValueAbsoluteValue,
      getSanityCheckData,
      getSanityChecksForDisplay,
      getDataForUpdateFPricing,
      getFinalPrice,
      getGpmValue,
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
 * Will return the recommended Price after sanity checks. Will be calculated by a special non-linear logic.
 *
 * the maximum allowed Value is the maxThreshold, minimum allowed value is the minThreshold.
 * When a customer Price is available, and it is between the min and max threshold, it will be taken into account.
 * When a recPriceBeforeSanityCheck is between the min and max threshold, it will be taken into account.
 * From the into Account taken values the higher the returned
 * when no lastCustomerPrice and no recPriceBeforeSanityCheck is available, the maxThreshold will be returned.
 * @param recPriceBeforeCheck
 * @param minThreshold
 * @param maxThreshold
 * @param lastCustomerPrice
 * @returns the price recommendation after sanity checks
 */
export function calculatePriceRecommendationAfterForSanityChecks(
  recPriceBeforeCheck: number,
  minThreshold: number,
  maxThreshold: number,
  lastCustomerPrice: number
): number {
  const maxValue = Math.max(
    isBetween(recPriceBeforeCheck, minThreshold, maxThreshold)
      ? recPriceBeforeCheck
      : null,
    isBetween(lastCustomerPrice, minThreshold, maxThreshold)
      ? lastCustomerPrice
      : null
  );

  return isBetween(maxValue, minThreshold, maxThreshold)
    ? maxValue
    : maxThreshold;
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
    delta.absolute = values[1].value - values[0].value;
    delta.relative = Math.round((delta.absolute / values[0].value) * 100);
  }

  return delta;
}

function isBetween(value: number, lower: number, upper: number): boolean {
  return value >= lower && value <= upper;
}

export interface SanityCheckData {
  recommendBeforeChecks: number;
  recommendAfterChecks: number;
  lowerThreshold: number;
  upperThreshold: number;
  lastCustomerPrice: number;
  sqv: number;
  sanityCheckValue: number;
}
