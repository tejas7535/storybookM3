import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { DetailService } from '../../../../detail/service/detail.service';
import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadReferenceType,
  loadReferenceTypeDetails,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import {
  BomItem,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { Calculation } from '../../reducers/shared/models/calculation.model';

@Injectable()
export class DetailEffects {
  referenceTypeDetails$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATED, loadReferenceTypeDetails.type),
        withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
        map(([_action, routerState]) => routerState),
        tap((routerState) => {
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
          this.store.dispatch(
            loadCalculations({
              materialNumber: routerState.state.queryParams['material_number'],
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  referenceType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadReferenceType),
      mergeMap((action) =>
        this.detailService.getDetails(action.referenceTypeId).pipe(
          map((item: ReferenceTypeResultModel) =>
            loadReferenceTypeSuccess({ item })
          ),
          catchError((_e) => of(loadReferenceTypeFailure()))
        )
      )
    );
  });

  bom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBom),
      mergeMap((action) =>
        this.detailService.getBom(action.bomIdentifier).pipe(
          map((items: BomItem[]) => loadBomSuccess({ items })),
          catchError((_e) => of(loadBomFailure()))
        )
      )
    );
  });

  calculations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCalculations),
      mergeMap((action) =>
        this.detailService.calculations(action.materialNumber).pipe(
          tap((items: Calculation[]) => {
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
            }
          }),
          map((items: Calculation[]) => loadCalculationsSuccess({ items })),
          catchError((_e) => of(loadCalculationsFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
