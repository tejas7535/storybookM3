/* eslint-disable max-lines */
import { PercentPipe } from '@angular/common';

import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { MarketValueDriverDisplayItem } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import {
  FPricingData,
  MarketValueDriver,
  MaterialInformation,
  PropertyValue,
  UpdateFPricingDataRequest,
} from '@gq/shared/models/f-pricing';
import { TechnicalValueDriver } from '@gq/shared/models/f-pricing/technical-value-driver.interface';
import { translate } from '@ngneat/transloco';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { MATERIAL_INFORMATION_MOCK } from '../../../../testing/mocks';
import { TECHNICAL_VALUE_DRIVERS_MOCK } from '../../../../testing/mocks/models/fpricing/technical-value-drivers.mock';
import {
  ComparableMaterialsRowData,
  FPricingComparableMaterials,
} from '../reducers/transactions/models/f-pricing-comparable-materials.interface';
import { FPricingActions } from './f-pricing.actions';
import { MarketValueDriverWarningLevel } from './models/market-value-driver-warning-level.enum';
import { MaterialInformationExtended } from './models/material-information-extended.interface';
import { PropertyDelta } from './models/property-delta.interface';

const TRANSLATION_KEY =
  'fPricing.pricingAssistantModal.tableRows.technicalValueDriver';

const percentPipe = new PercentPipe('en-US');

export interface FPricingState extends FPricingData {
  fPricingDataLoading: boolean;
  comparableTransactionsLoading: boolean;
  error: Error;
  materialInformation: MaterialInformation[];
  comparableTransactions: FPricingComparableMaterials[];
  marketValueDriversSelections: MarketValueDriverSelection[];
  // the price could either be the reference price or the manual price
  priceSelected: number;
  technicalValueDriversToUpdate: TableItem[];
}

export const initialState: FPricingState = {
  fPricingDataLoading: false,
  comparableTransactionsLoading: false,
  error: null,
  materialInformation: MATERIAL_INFORMATION_MOCK,
  gqPositionId: null,
  referencePrice: null,
  productType: null,
  marketValueDrivers: null,
  comparableTransactions: null,
  marketValueDriversSelections: [],
  priceSelected: null,
  technicalValueDrivers: TECHNICAL_VALUE_DRIVERS_MOCK,
  technicalValueDriversToUpdate: [],
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
    )
  ),

  extraSelectors: ({
    selectMaterialInformation,
    selectMarketValueDrivers,
    selectComparableTransactions,
    selectMarketValueDriversSelections,
    selectPriceSelected,
    selectTechnicalValueDrivers,
    selectTechnicalValueDriversToUpdate,
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
      selectComparableTransactions,
      (comparableTransactions: FPricingComparableMaterials[]): boolean =>
        comparableTransactions?.length > 0
    );
    const getMarketValueDriverForDisplay = createSelector(
      selectMarketValueDrivers,
      (
        marketValueDriver: MarketValueDriver[]
      ): MarketValueDriverDisplayItem[] => {
        if (!marketValueDriver) {
          return [];
        }

        return marketValueDriver.map((item) => {
          const displayItem: MarketValueDriverDisplayItem = {
            questionId: item.questionId,
            options: item.options.map((option) => ({
              optionId: option.optionId,
              selected: item.selectedOptionId === option.optionId,
            })),
          };

          return displayItem;
        });
      }
    );
    // aggregate both lists of market Value driver selections (db values and userSelections)
    const getAggregatedMarketValueDrivers = createSelector(
      selectMarketValueDrivers,
      selectMarketValueDriversSelections,
      (
        marketValueDriver: MarketValueDriver[],
        mvdUserSelection: MarketValueDriverSelection[]
      ): AggregateList[] =>
        createAggregatedList(marketValueDriver, mvdUserSelection)
    );
    // is there any selection made that is not the last option, then a selection other than default is made
    const getAnyMarketValueDriverSelected = createSelector(
      getAggregatedMarketValueDrivers,
      (aggrList: AggregateList[]): boolean =>
        aggrList?.some((item) => !item.unknown)
    );
    // check if all the selections are made and not the last option
    const getAllMarketValueDriverSelected = createSelector(
      getAggregatedMarketValueDrivers,
      (aggrList: AggregateList[]): boolean =>
        aggrList?.every((item) => !item.unknown)
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
        const list = [
          {
            id: 1,
            description: translate(`${TRANSLATION_KEY}.heatTreatment`),

            value: percentPipe.transform(
              technicalValueDriver.heatTreatmentSurcharge
            ),
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 1
            )?.editableValue,
          } as TableItem,
          {
            id: 2,
            description: translate(`${TRANSLATION_KEY}.toleranceClass`),
            value: percentPipe.transform(
              technicalValueDriver.toleranceClassSurcharge
            ),
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 2
            )?.editableValue,
          },
          {
            id: 3,
            description: translate(`${TRANSLATION_KEY}.radialClearance`),
            value: percentPipe.transform(
              technicalValueDriver.clearanceRadialSurcharge
            ),
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 3
            )?.editableValue,
          },
          {
            id: 4,
            description: translate(`${TRANSLATION_KEY}.axialClearance`),
            value: percentPipe.transform(
              technicalValueDriver.clearanceAxialSurcharge
            ),
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 4
            )?.editableValue,
          },
          {
            id: 5,
            description: translate(`${TRANSLATION_KEY}.engineeringEffort`),
            value: percentPipe.transform(
              technicalValueDriver.engineeringEffortSurcharge
            ),
            editableValueUnit: '%',
            editableValue: technicalValueDriverUpdated.find(
              (item) => item.id === 5
            )?.editableValue,
          },
        ];

        return list;
      }
    );

    const getDataForUpdateFPricing = createSelector(
      selectMarketValueDriversSelections,
      selectPriceSelected,
      (
        marketValueDriverSelections,
        selectedPrice
      ): UpdateFPricingDataRequest => ({
        marketValueDriverSelections,
        selectedPrice,
      })
    );

    return {
      getMaterialInformationExtended,
      getComparableTransactionsForDisplaying,
      getComparableTransactionsAvailable,
      getMarketValueDriverForDisplay,
      getAggregatedMarketValueDrivers,
      getAnyMarketValueDriverSelected,
      getAllMarketValueDriverSelected,
      getMarketValueDriverWarningLevel,
      getTechnicalValueDriversForDisplay,
      getDataForUpdateFPricing,
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
 * aggregate the market value drivers from db and the user selections.
 * it is checked for unknown selection.
 * when user selection has been made it is taken into account for this list, otherwise the db selection is taken into account.
 *
 * @param marketValueDriver the market value driver from db
 * @param userSelections the selections the user has made
 * @returns aggregated list of market value drivers and user selections
 */
export function createAggregatedList(
  marketValueDriver: MarketValueDriver[],
  userSelections: MarketValueDriverSelection[]
): AggregateList[] {
  return marketValueDriver?.map(({ questionId, options, selectedOptionId }) => {
    const userSelection = userSelections.find(
      (selection) => selection.questionId === questionId
    );
    const unknown = userSelection
      ? userSelection.selectedOptionId === options.length
      : selectedOptionId === options.length;

    return { questionId, unknown };
  });
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

interface AggregateList {
  questionId: number;
  unknown: boolean;
}
