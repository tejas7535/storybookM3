import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { DetailRoutePath } from '../../../../detail/detail-route-path.enum';
import { DetailService } from '../../../../detail/service/detail.service';
import {
  ERROR_BOM_NO_CALCULATION_FOUND,
  ERROR_CALCULATIONS_EMPTY_RESULT,
} from '../../../../shared/constants';
import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import {
  BomItem,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { Calculation } from '../../reducers/shared/models/calculation.model';
import {
  getBomItems,
  getCalculations,
  getReferenceType,
} from '../../selectors/details/detail.selector';

@Injectable()
export class DetailEffects {
  referenceTypeDetails$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
        map(([_action, routerState]) => routerState),
        tap((routerState) => {
          const path = routerState.state.url
            .split('/detail/')[1]
            ?.split('?')[0];

          if (path === DetailRoutePath.DetailsPath) {
            this.store.dispatch(
              loadReferenceType({
                referenceTypeId: {
                  materialNumber:
                    routerState.state.queryParams['material_number'],
                  plant: routerState.state.queryParams.plant,
                  rfq: routerState.state.queryParams.rfq,
                  pcmCalculationDate:
                    routerState.state.queryParams['pcm_calculation_date'],
                  pcmQuantity: routerState.state.queryParams['pcm_quantity'],
                },
              })
            );
          } else if (path === DetailRoutePath.BomPath) {
            this.store.dispatch(
              loadCalculations({
                materialNumber:
                  routerState.state.queryParams['material_number'],
                includeBom: true,
              })
            );
          } else if (path === DetailRoutePath.CalculationsPath) {
            this.store.dispatch(
              loadCalculations({
                materialNumber:
                  routerState.state.queryParams['material_number'],
                includeBom: false,
              })
            );
          }
        })
      );
    },
    { dispatch: false }
  );

  referenceType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadReferenceType),
      withLatestFrom(this.store.pipe(select(getReferenceType))),
      filter(
        // only load data if not already loaded
        ([action, refType]) =>
          refType === undefined ||
          !(
            refType.materialNumber === action.referenceTypeId.materialNumber &&
            refType.plant === action.referenceTypeId.plant &&
            refType.rfq === action.referenceTypeId.rfq &&
            refType.pcmCalculationDate ===
              action.referenceTypeId.pcmCalculationDate &&
            refType.pcmQuantity === action.referenceTypeId.pcmQuantity
          )
      ),
      map(([action, _refType]) => action),
      mergeMap((action) =>
        this.detailService.getDetails(action.referenceTypeId).pipe(
          map((item: ReferenceTypeResultModel) =>
            loadReferenceTypeSuccess({ item })
          ),
          catchError((errorMessage) =>
            of(loadReferenceTypeFailure({ errorMessage }))
          )
        )
      )
    );
  });

  bom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBom),
      withLatestFrom(this.store.pipe(select(getBomItems))),
      filter(
        // only load data if not already loaded
        ([action, items]) =>
          items === undefined ||
          items.length === 0 ||
          !(
            items[0].bomCostingDate === action.bomIdentifier.bomCostingDate &&
            items[0].bomCostingNumber ===
              action.bomIdentifier.bomCostingNumber &&
            items[0].bomCostingType === action.bomIdentifier.bomCostingType &&
            items[0].bomCostingVersion ===
              action.bomIdentifier.bomCostingVersion &&
            items[0].bomEnteredManually ===
              action.bomIdentifier.bomEnteredManually &&
            items[0].bomReferenceObject ===
              action.bomIdentifier.bomReferenceObject &&
            items[0].bomValuationVariant ===
              action.bomIdentifier.bomValuationVariant
          )
      ),
      map(([action, _refType]) => action),
      mergeMap((action) =>
        this.detailService.getBom(action.bomIdentifier).pipe(
          map((items: BomItem[]) => loadBomSuccess({ items })),
          catchError((errorMessage) => of(loadBomFailure({ errorMessage })))
        )
      )
    );
  });

  calculations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCalculations),
      withLatestFrom(this.store.pipe(select(getCalculations))),
      filter(
        // only load data if not already loaded
        ([action, calculations]) =>
          calculations === undefined ||
          calculations.length === 0 ||
          action.includeBom || // always reload calculations if BOM should be loaded
          calculations[0].materialNumber !== action.materialNumber
      ),
      map(([action, _refType]) => action),
      mergeMap((action) =>
        this.detailService.calculations(action.materialNumber).pipe(
          tap((items: Calculation[]) =>
            this.loadBomEventually(action.includeBom, items)
          ),
          map((items: Calculation[]) => {
            if (items.length > 0) {
              return loadCalculationsSuccess({ items });
            }

            const errorMessage = ERROR_CALCULATIONS_EMPTY_RESULT;

            return loadCalculationsFailure({ errorMessage });
          }),
          catchError((errorMessage) => {
            this.loadBomEventually(action.includeBom, []);

            return of(loadCalculationsFailure({ errorMessage }));
          })
        )
      )
    );
  });

  private loadBomEventually(includeBom: boolean, items: Calculation[]): void {
    if (includeBom) {
      if (items.length > 0) {
        const {
          bomCostingDate,
          bomCostingNumber,
          bomCostingType,
          bomCostingVersion,
          bomEnteredManually,
          bomReferenceObject,
          bomValuationVariant,
        } = items[0];
        const bomIdentifier = {
          bomCostingDate,
          bomCostingNumber,
          bomCostingType,
          bomCostingVersion,
          bomEnteredManually,
          bomReferenceObject,
          bomValuationVariant,
        };

        this.store.dispatch(loadBom({ bomIdentifier }));
      } else {
        const errorMessage = ERROR_BOM_NO_CALCULATION_FOUND;
        this.store.dispatch(loadBomFailure({ errorMessage }));
      }
    }
  }

  constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
