import { computed, effect, inject } from '@angular/core';

import { pipe, switchMap, tap } from 'rxjs';

import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { ProductionPlantService } from '@gq/calculator/rfq-4-detail-view/service/rest/production-plant.service';
import { getRouteQueryParams } from '@gq/core/store/selectors/router/router.selector';
import { ActiveDirectoryUser } from '@gq/shared/models';
import { MicrosoftGraphMapperService } from '@gq/shared/services/rest/microsoft-graph-mapper/microsoft-graph-mapper.service';
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

import {
  CalculatorQuotationData,
  CalculatorQuotationDetailData,
  CalculatorRfq4ProcessData,
  ProductionPlantData,
  ProductionPlantForRfq,
  RfqDetailViewData,
} from '../models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewService } from '../service/rest/rfq-4-detail-view.service';
import { RFQ4_DETAIL_VIEW_ACTIONS } from './actions.const';

interface Rfq4DetailViewState {
  rfq4DetailViewData: RfqDetailViewData | null;
  processStartedByAdUser: ActiveDirectoryUser;
  loading: boolean;
  productionPlantData: ProductionPlantData | null;
}

const initalState: Rfq4DetailViewState = {
  rfq4DetailViewData: null,
  processStartedByAdUser: undefined,
  loading: false,
  productionPlantData: null,
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
  })),
  withProps(() => ({
    rfq4DetailViewService: inject(Rfq4DetailViewService),
    msGraphMapperService: inject(MicrosoftGraphMapperService),
    productionPlantService: inject(ProductionPlantService),
  })),
  withMethods(
    ({
      rfq4DetailViewService,
      msGraphMapperService,
      productionPlantService,
      ...store
    }) => {
      const loadAdUser = rxMethod<string>(
        pipe(
          tap(() =>
            updateState(store, RFQ4_DETAIL_VIEW_ACTIONS.LOAD_AD_USER, {
              loading: true,
            })
          ),
          switchMap((userId: string) =>
            msGraphMapperService
              .getActiveDirectoryUserByMultipleUserIds([userId])
              .pipe(
                tapResponse({
                  next: (users) => {
                    updateState(
                      store,
                      RFQ4_DETAIL_VIEW_ACTIONS.LOAD_AD_USER_SUCCESS,
                      {
                        processStartedByAdUser:
                          users && users.length > 0 ? users[0] : undefined,
                      },
                      {
                        loading: false,
                      }
                    );
                  },
                  error: () =>
                    updateState(
                      store,
                      RFQ4_DETAIL_VIEW_ACTIONS.LOAD_AD_USER_FAILURE,
                      { loading: false }
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
              { loading: true }
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
                    }
                  );
                },
                error: () =>
                  updateState(
                    store,
                    RFQ4_DETAIL_VIEW_ACTIONS.LOAD_RFQ4_DETAIL_VIEW_DATA_FAILURE,
                    { loading: false }
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

      return { loadRfq4DetailViewData, loadAdUser, loadProductionPlants };
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

      store.loadProductionPlants();

      effect(() => {
        const startedByUserId = store.getRfq4ProcessData()?.startedByUserId;
        if (startedByUserId) {
          store.loadAdUser(startedByUserId);
        }
      });
    },
  }))
);
