/* eslint-disable max-lines */
import { computed, effect, inject } from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of, pipe, switchMap, tap } from 'rxjs';

import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { ProductionPlantService } from '@gq/calculator/rfq-4-detail-view/service/rest/production-plant.service';
import { getRouteQueryParams } from '@gq/core/store/selectors/router/router.selector';
import { ActiveDirectoryUser } from '@gq/shared/models';
import { CurrencyService } from '@gq/shared/services/rest/currency/currency.service';
import { MicrosoftGraphMapperService } from '@gq/shared/services/rest/microsoft-graph-mapper/microsoft-graph-mapper.service';
import { translate } from '@jsverse/transloco';
import { tapResponse } from '@ngrx/operators';
import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

import { RecalculateSqvStatus } from '../models/recalculate-sqv-status.enum';
import {
  CalculatorQuotationData,
  CalculatorQuotationDetailData,
  CalculatorRfq4ProcessData,
  ConfirmRfqResponse,
  ProductionPlantData,
  ProductionPlantForRfq,
  RfqDetailViewCalculationData,
  RfqDetailViewData,
} from '../models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewService } from '../service/rest/rfq-4-detail-view.service';
import { RFQ4_DETAIL_VIEW_ACTIONS } from './actions.const';

interface Rfq4DetailViewState {
  rfq4DetailViewData: RfqDetailViewData | null;
  rfq4DetailViewDataLoading: boolean;
  processStartedByAdUser: ActiveDirectoryUser;
  processStartedByAdUserLoading: boolean;
  processAssignedToAdUser: ActiveDirectoryUser;
  processAssignedToAdUserLoading: boolean;
  productionPlantData: ProductionPlantData | null;
  rfq4RecalculationDataStatus: FormControlStatus;
  confirmRecalculationTriggered: boolean;
  exchangeRateForSelectedCurrency: number;
  exchangeRateForSelectedCurrencyLoading: boolean;
  loggedUserId: string;
}

const initalState: Rfq4DetailViewState = {
  rfq4DetailViewData: null,
  rfq4DetailViewDataLoading: false,
  processStartedByAdUser: undefined,
  processStartedByAdUserLoading: false,
  processAssignedToAdUser: undefined,
  processAssignedToAdUserLoading: false,
  productionPlantData: null,
  rfq4RecalculationDataStatus: null,
  confirmRecalculationTriggered: false,
  exchangeRateForSelectedCurrency: null,
  exchangeRateForSelectedCurrencyLoading: false,
  loggedUserId: null,
};

export const Rfq4DetailViewStore = signalStore(
  withDevtools('Rfq4DetailViewStore'),
  withState(initalState),
  withComputed((store) => ({
    getQuotationDetailData: computed(
      (): CalculatorQuotationDetailData =>
        store.rfq4DetailViewData()?.quotationDetailData
    ),
    getRfq4ProcessData: computed(
      (): CalculatorRfq4ProcessData =>
        store.rfq4DetailViewData()?.rfq4ProcessData
    ),
    getQuotationData: computed(
      (): CalculatorQuotationData => store.rfq4DetailViewData()?.quotationData
    ),
    getProductionPlants: computed(
      (): ProductionPlantForRfq[] =>
        store.productionPlantData()?.productionPlants
    ),
    getProductionPlantsLoading: computed(
      (): boolean => store.productionPlantData()?.loading
    ),
    getProcessProductionPlant: computed(
      (): string =>
        store.rfq4DetailViewData()?.rfq4ProcessData?.processProductionPlant
    ),
    getStartedByUserId: computed(
      (): string => store.rfq4DetailViewData()?.rfq4ProcessData.startedByUserId
    ),
    getAssignedUserId: computed(
      (): string => store.rfq4DetailViewData()?.rfq4ProcessData.assignedUserId
    ),
    getProductStructureUrl: computed(
      (): string =>
        store.rfq4DetailViewData()?.quotationDetailData.materialData
          .productStructureUrl
    ),
    getRecalculationStatus: computed(
      (): RecalculateSqvStatus =>
        store.rfq4DetailViewData()?.rfq4ProcessData
          .calculatorRequestRecalculationStatus
    ),
    getRfq4DetailViewCalculationData: computed(
      (): RfqDetailViewCalculationData =>
        store.rfq4DetailViewData()?.rfq4RecalculationData
    ),
    getSelectedProdPlant: computed(
      (): string =>
        store.rfq4DetailViewData()?.rfq4RecalculationData
          ?.productionPlantNumber ??
        store.rfq4DetailViewData().rfq4ProcessData.processProductionPlant
    ),
    isCalculationDataInvalid: computed(
      (): boolean => store.rfq4RecalculationDataStatus() === 'INVALID'
    ),
    isLoggedUserAssignedToRfq: computed(
      (): boolean =>
        store.rfq4DetailViewData()?.rfq4ProcessData.assignedUserId ===
        store.loggedUserId()
    ),
  })),
  withProps(() => ({
    rfq4DetailViewService: inject(Rfq4DetailViewService),
    msGraphMapperService: inject(MicrosoftGraphMapperService),
    productionPlantService: inject(ProductionPlantService),
    currencyService: inject(CurrencyService),
    snackBar: inject(MatSnackBar),
  })),
  withMethods(
    ({
      rfq4DetailViewService,
      msGraphMapperService,
      productionPlantService,
      currencyService,
      snackBar,
      ...store
    }) => {
      const loadProcessAssignedToAdUser = rxMethod<{
        userId: string;
      }>(
        pipe(
          tap(() =>
            updateState(store, RFQ4_DETAIL_VIEW_ACTIONS.LOAD_ASSIGNED_AD_USER, {
              processAssignedToAdUserLoading: true,
            })
          ),
          switchMap((obj: { userId: string }) =>
            msGraphMapperService
              .getActiveDirectoryUserByUserId(obj.userId)
              .pipe(
                tapResponse({
                  next: (user) => {
                    updateState(
                      store,
                      RFQ4_DETAIL_VIEW_ACTIONS.LOAD_ASSIGNED_AD_USER_SUCCESS,
                      {
                        processAssignedToAdUser: user,
                      },
                      {
                        processAssignedToAdUserLoading: false,
                      }
                    );
                  },
                  error: () =>
                    updateState(
                      store,
                      RFQ4_DETAIL_VIEW_ACTIONS.LOAD_ASSIGNED_AD_USER_FAILURE,
                      { processAssignedToAdUserLoading: false }
                    ),
                })
              )
          )
        )
      );

      const loadProcessStartedByAdUser = rxMethod<{
        userId: string;
      }>(
        pipe(
          tap(() =>
            updateState(
              store,
              RFQ4_DETAIL_VIEW_ACTIONS.LOAD_STARTED_BY_AD_USER,
              {
                processStartedByAdUserLoading: true,
              }
            )
          ),
          switchMap((obj: { userId: string }) =>
            msGraphMapperService
              .getActiveDirectoryUserByUserId(obj.userId)
              .pipe(
                tapResponse({
                  next: (user) => {
                    updateState(
                      store,
                      RFQ4_DETAIL_VIEW_ACTIONS.LOAD_STARTED_BY_AD_USER_SUCCESS,
                      {
                        processStartedByAdUser: user,
                      },
                      {
                        processStartedByAdUserLoading: false,
                      }
                    );
                  },
                  error: () =>
                    updateState(
                      store,
                      RFQ4_DETAIL_VIEW_ACTIONS.LOAD_STARTED_BY_AD_USER_FAILURE,
                      { processStartedByAdUserLoading: false }
                    ),
                })
              )
          )
        )
      );

      const loadRfq4DetailViewData = rxMethod<string>(
        pipe(
          tap(() =>
            updateState(
              store,
              RFQ4_DETAIL_VIEW_ACTIONS.LOAD_RFQ4_DETAIL_VIEW_DATA,
              { rfq4DetailViewDataLoading: true }
            )
          ),
          switchMap((rfqId: string) =>
            rfq4DetailViewService.getRfq4DetailViewData(rfqId).pipe(
              tapResponse({
                next: (rfq4Data: RfqDetailViewData) => {
                  updateState(
                    store,
                    RFQ4_DETAIL_VIEW_ACTIONS.LOAD_RFQ4_DETAIL_VIEW_DATA_SUCCESS,
                    {
                      rfq4DetailViewData: rfq4Data,
                    },
                    {
                      rfq4DetailViewDataLoading: false,
                    }
                  );
                  if (
                    rfq4Data.rfq4ProcessData
                      .calculatorRequestRecalculationStatus ===
                    RecalculateSqvStatus.CANCELLED
                  ) {
                    const message = translate(
                      'calculator.rfq4DetailView.recalculation.snackBarMessages.cancelled',
                      { rfqId: rfq4Data.rfq4ProcessData.rfqId }
                    );
                    snackBar.open(message);
                  }
                },
                error: () =>
                  updateState(
                    store,
                    RFQ4_DETAIL_VIEW_ACTIONS.LOAD_RFQ4_DETAIL_VIEW_DATA_FAILURE,
                    { rfq4DetailViewDataLoading: false }
                  ),
              })
            )
          )
        )
      );

      const loadProductionPlants = rxMethod<void>(
        pipe(
          tap(() =>
            updateState(
              store,
              RFQ4_DETAIL_VIEW_ACTIONS.LOAD_PRODUCTION_PLANTS,
              {
                productionPlantData: {
                  productionPlants: null,
                  loading: true,
                },
              }
            )
          ),
          switchMap(() =>
            productionPlantService.getProductionPlantsForRfq().pipe(
              tapResponse({
                next: (productionPlants) => {
                  updateState(
                    store,
                    RFQ4_DETAIL_VIEW_ACTIONS.LOAD_PRODUCTION_PLANTS_SUCCESS,
                    {
                      productionPlantData: {
                        productionPlants: productionPlants.results,
                        loading: false,
                      },
                    }
                  );
                },
                error: () =>
                  updateState(
                    store,
                    RFQ4_DETAIL_VIEW_ACTIONS.LOAD_PRODUCTION_PLANTS_FAILURE,
                    {
                      productionPlantData: {
                        productionPlants: null,
                        loading: false,
                      },
                    }
                  ),
              })
            )
          )
        )
      );
      const saveRfq4DetailViewCalculationData =
        rxMethod<RfqDetailViewCalculationData>(
          pipe(
            tap((calculationData: RfqDetailViewCalculationData) =>
              updateState(
                store,
                RFQ4_DETAIL_VIEW_ACTIONS.SAVE_RFQ4_DETAIL_VIEW_CALCULATION_DATA,
                {
                  rfq4DetailViewData: {
                    ...store.rfq4DetailViewData(),
                    rfq4RecalculationData: calculationData,
                  },
                  rfq4DetailViewDataLoading: true,
                }
              )
            ),
            switchMap((calculationData: RfqDetailViewCalculationData) =>
              rfq4DetailViewService
                .saveRfq4CalculationData(
                  store.getRfq4ProcessData()?.rfqId,
                  calculationData
                )
                .pipe(
                  tapResponse({
                    next: (response: RfqDetailViewCalculationData) => {
                      updateState(
                        store,
                        RFQ4_DETAIL_VIEW_ACTIONS.SAVE_RFQ4_DETAIL_VIEW_CALCULATION_DATA_SUCCESS,
                        {
                          rfq4DetailViewData: {
                            ...store.rfq4DetailViewData(),
                            rfq4RecalculationData: response,
                          },
                          rfq4DetailViewDataLoading: false,
                        }
                      );
                      const successMessage = translate(
                        'calculator.rfq4DetailView.recalculation.snackBarMessages.saved'
                      );
                      snackBar.open(successMessage);
                    },
                    error: () => {
                      updateState(
                        store,
                        RFQ4_DETAIL_VIEW_ACTIONS.SAVE_RFQ4_DETAIL_VIEW_CALCULATION_DATA_FAILURE,
                        { rfq4DetailViewDataLoading: false }
                      );
                      const errorMessage = translate(
                        'calculator.rfq4DetailView.recalculation.snackBarMessages.error'
                      );
                      snackBar.open(errorMessage);
                    },
                  })
                )
            )
          )
        );

      const setCalculationDataStatus = rxMethod<FormControlStatus>(
        pipe(
          tap((status) =>
            updateState(
              store,
              RFQ4_DETAIL_VIEW_ACTIONS.SET_CALCULATION_DATA_STATUS,
              {
                rfq4RecalculationDataStatus: status,
              }
            )
          )
        )
      );

      const triggerConfirmRecalculation = rxMethod<void>(
        pipe(
          tap(() =>
            updateState(
              store,
              RFQ4_DETAIL_VIEW_ACTIONS.CONFIRM_RFQ4_DETAIL_VIEW_CALCULATION_DATA_TRIGGERED,
              {
                confirmRecalculationTriggered: true,
              }
            )
          )
        )
      );

      const confirmRfq4DetailViewCalculationData =
        rxMethod<RfqDetailViewCalculationData>(
          pipe(
            tap((calculationData: RfqDetailViewCalculationData) =>
              updateState(
                store,
                RFQ4_DETAIL_VIEW_ACTIONS.CONFIRM_RFQ4_DETAIL_VIEW_CALCULATION_DATA,
                {
                  rfq4DetailViewData: {
                    ...store.rfq4DetailViewData(),
                    rfq4RecalculationData: calculationData,
                  },
                  rfq4DetailViewDataLoading: true,
                }
              )
            ),
            switchMap((calculationData: RfqDetailViewCalculationData) =>
              rfq4DetailViewService
                .confirmRfq4CalculationData(
                  store.getRfq4ProcessData()?.rfqId,
                  calculationData
                )
                .pipe(
                  tapResponse({
                    next: (response: ConfirmRfqResponse) => {
                      updateState(
                        store,
                        RFQ4_DETAIL_VIEW_ACTIONS.CONFIRM_RFQ4_DETAIL_VIEW_CALCULATION_DATA_SUCCESS,
                        {
                          rfq4DetailViewData: {
                            ...store.rfq4DetailViewData(),
                            rfq4ProcessData: {
                              ...store.rfq4DetailViewData().rfq4ProcessData,
                              calculatorRequestRecalculationStatus:
                                response.calculatorRequestRecalculationStatus,
                            },
                            rfq4RecalculationData:
                              response.rfq4RecalculationData,
                          },
                          rfq4DetailViewDataLoading: false,
                          confirmRecalculationTriggered: false,
                        }
                      );
                      const successMessage = translate(
                        'calculator.rfq4DetailView.recalculation.snackBarMessages.confirmed'
                      );
                      snackBar.open(successMessage);
                    },
                    error: () => {
                      updateState(
                        store,
                        RFQ4_DETAIL_VIEW_ACTIONS.CONFIRM_RFQ4_DETAIL_VIEW_CALCULATION_DATA_FAILURE,
                        {
                          rfq4DetailViewDataLoading: false,
                          confirmRecalculationTriggered: false,
                        }
                      );
                      const errorMessage = translate(
                        'calculator.rfq4DetailView.recalculation.snackBarMessages.confirmError'
                      );
                      snackBar.open(errorMessage);
                    },
                  })
                )
            )
          )
        );

      const assignRfq = rxMethod<void>(
        pipe(
          tap(() =>
            updateState(store, RFQ4_DETAIL_VIEW_ACTIONS.ASSIGN_RFQ, {
              rfq4DetailViewDataLoading: true,
            })
          ),
          switchMap(() =>
            rfq4DetailViewService
              .assignRfq(store.getRfq4ProcessData().rfqId)
              .pipe(
                tapResponse({
                  next: (rfq4ProcessData: CalculatorRfq4ProcessData) => {
                    updateState(
                      store,
                      RFQ4_DETAIL_VIEW_ACTIONS.ASSIGN_RFQ_SUCCESS,
                      {
                        rfq4DetailViewData: {
                          ...store.rfq4DetailViewData(),
                          rfq4ProcessData,
                        },
                      },
                      {
                        rfq4DetailViewDataLoading: false,
                      }
                    );
                    const toastMessage = translate(
                      'calculator.rfq4DetailView.snackBarMessages.assignRfq'
                    );
                    snackBar.open(toastMessage);
                  },
                  error: () =>
                    updateState(
                      store,
                      RFQ4_DETAIL_VIEW_ACTIONS.ASSIGN_RFQ_FAILURE,
                      { rfq4DetailViewDataLoading: false }
                    ),
                })
              )
          )
        )
      );

      const getExchangeRateForSelectedCurrency = rxMethod<string>(
        pipe(
          tap(() =>
            updateState(
              store,
              RFQ4_DETAIL_VIEW_ACTIONS.GET_EXCHANGE_RATE_FOR_SELECTED_CURRENCY,
              {
                exchangeRateForSelectedCurrencyLoading: true,
              }
            )
          ),
          switchMap((selectedCurrency) => {
            const quotationCurrency = store.getQuotationData().currency;

            if (selectedCurrency === quotationCurrency) {
              // Currency is the same, set exchangeRateForSelectedCurrency to 1
              updateState(
                store,
                RFQ4_DETAIL_VIEW_ACTIONS.GET_EXCHANGE_RATE_FOR_SELECTED_CURRENCY_SUCCESS,
                {
                  exchangeRateForSelectedCurrency: 1,
                  exchangeRateForSelectedCurrencyLoading: false,
                }
              );

              return of(null); // Return an observable that completes immediately
            } else {
              // Currency is different, fetch the exchange rate
              return currencyService
                .getExchangeRateForCurrency(selectedCurrency, quotationCurrency)
                .pipe(
                  tapResponse({
                    next: (response) => {
                      updateState(
                        store,
                        RFQ4_DETAIL_VIEW_ACTIONS.GET_EXCHANGE_RATE_FOR_SELECTED_CURRENCY_SUCCESS,
                        {
                          exchangeRateForSelectedCurrency:
                            response?.exchangeRates[quotationCurrency],
                          exchangeRateForSelectedCurrencyLoading: false,
                        }
                      );
                    },
                    error: () => {
                      updateState(
                        store,
                        RFQ4_DETAIL_VIEW_ACTIONS.GET_EXCHANGE_RATE_FOR_SELECTED_CURRENCY_FAILURE,
                        {
                          exchangeRateForSelectedCurrencyLoading: false,
                        }
                      );
                    },
                  })
                );
            }
          })
        )
      );

      const setLoggedUser = rxMethod<string>(
        pipe(
          tap((userId: string) =>
            updateState(store, RFQ4_DETAIL_VIEW_ACTIONS.SET_LOGGED_USER, {
              loggedUserId: userId,
            })
          )
        )
      );

      return {
        loadRfq4DetailViewData,
        loadProcessAssignedToAdUser,
        loadProcessStartedByAdUser,
        assignRfq,
        loadProductionPlants,
        saveRfq4DetailViewCalculationData,
        triggerConfirmRecalculation,
        confirmRfq4DetailViewCalculationData,
        setCalculationDataStatus,
        getExchangeRateForSelectedCurrency,
        setLoggedUser,
      };
    }
  ),
  withHooks((store, globalStore = inject(Store)) => ({
    onInit(): void {
      globalStore
        .select(getRouteQueryParams)
        .pipe(
          tap((queryParams) => {
            const rfqId = queryParams['rfqId'];
            store.loadRfq4DetailViewData(rfqId);
          })
        )
        .subscribe();

      globalStore
        .select(getUserUniqueIdentifier)
        .pipe(
          tap((userId) => {
            if (userId) {
              store.setLoggedUser(userId);
            }
          })
        )
        .subscribe();

      store.loadProductionPlants();

      effect(() => {
        const startedByUserId = store.getStartedByUserId();
        if (startedByUserId) {
          store.loadProcessStartedByAdUser({
            userId: startedByUserId,
          });
        }
      });
      effect(() => {
        const assigneeId = store.getAssignedUserId();
        if (assigneeId) {
          store.loadProcessAssignedToAdUser({
            userId: assigneeId,
          });
        }
      });
    },
  }))
);
