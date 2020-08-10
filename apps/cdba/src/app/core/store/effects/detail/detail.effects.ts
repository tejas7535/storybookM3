import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailService } from '../../../../detail/service/detail.service';
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
  selectCalculation,
  selectReferenceType,
} from '../../actions';
import * as fromRouter from '../../reducers';
import {
  BomIdentifier,
  BomItem,
  ReferenceTypeIdentifier,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { Calculation } from '../../reducers/shared/models/calculation.model';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifier,
} from '../../selectors/details/detail.selector';

@Injectable()
export class DetailEffects {
  loadReferenceType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReferenceType),
      withLatestFrom(
        this.store.pipe(select(getSelectedReferenceTypeIdentifier))
      ),
      map(([_action, refTypeIdentifier]) => refTypeIdentifier),
      mergeMap((refTypeIdentifier: ReferenceTypeIdentifier) =>
        this.detailService.getDetails(refTypeIdentifier).pipe(
          map((item: ReferenceTypeResultModel) =>
            loadReferenceTypeSuccess({ item })
          ),
          catchError((errorMessage) =>
            of(loadReferenceTypeFailure({ errorMessage }))
          )
        )
      )
    )
  );

  loadCalculations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculations),
      withLatestFrom(
        this.store.pipe(select(getSelectedReferenceTypeIdentifier))
      ),
      map(([_action, refTypeIdentifier]) => refTypeIdentifier),
      map(
        (refTypeIdentifier: ReferenceTypeIdentifier) =>
          refTypeIdentifier.materialNumber
      ),
      mergeMap((materialNumber: string) =>
        this.detailService.calculations(materialNumber).pipe(
          map((items: Calculation[]) => loadCalculationsSuccess({ items })),
          catchError((errorMessage) =>
            of(loadCalculationsFailure({ errorMessage }))
          )
        )
      )
    )
  );

  triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation, loadCalculationsSuccess),
      map(loadBom)
    )
  );

  loadBom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBom),
      withLatestFrom(
        this.store.pipe(select(getBomIdentifierForSelectedCalculation))
      ),
      map(([_action, bomIdentifier]) => bomIdentifier),
      mergeMap((bomIdentifier: BomIdentifier) =>
        this.detailService.getBom(bomIdentifier).pipe(
          map((items: BomItem[]) => loadBomSuccess({ items })),
          catchError((errorMessage) => of(loadBomFailure({ errorMessage })))
        )
      )
    )
  );

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectReferenceType),
      mergeMap(() => {
        return [loadReferenceType(), loadCalculations()];
      })
    )
  );

  selectReferenceType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState) => routerState.url.indexOf(AppRoutePath.DetailPath) >= 0
      ),
      map((routerState) =>
        DetailEffects.mapQueryParamsToIdentifier(routerState.queryParams)
      ),
      filter((referenceTypeIdentifier: ReferenceTypeIdentifier) => {
        if (referenceTypeIdentifier === undefined) {
          this.router.navigate(['not-found']);
        }

        return referenceTypeIdentifier !== undefined;
      }),
      withLatestFrom(
        this.store.pipe(select(getSelectedReferenceTypeIdentifier))
      ),
      filter(
        ([identifierFromRoute, identifierCurrent]) =>
          !DetailEffects.checkEqualityOfIdentifier(
            identifierFromRoute,
            identifierCurrent
          )
      ),
      map(([identifierFromRoute, _identifierCurrent]) => identifierFromRoute),
      map((referenceTypeIdentifier: ReferenceTypeIdentifier) =>
        selectReferenceType({ referenceTypeIdentifier })
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store<fromRouter.AppState>,
    private readonly router: Router
  ) {}

  private static mapQueryParamsToIdentifier(
    queryParams: any
  ): ReferenceTypeIdentifier {
    const materialNumber = queryParams['material_number'];
    const pcmCalculationDate = queryParams['pcm_calculation_date'];
    const pcmQuantity = queryParams['pcm_quantity'];

    const { plant, rfq } = queryParams;

    return materialNumber && plant
      ? {
          materialNumber,
          plant,
          rfq,
          pcmCalculationDate,
          pcmQuantity,
        }
      : undefined;
  }

  private static checkEqualityOfIdentifier(
    fromRoute: ReferenceTypeIdentifier,
    current: ReferenceTypeIdentifier
  ): boolean {
    return (
      fromRoute.materialNumber === current?.materialNumber &&
      fromRoute.plant === current.plant &&
      fromRoute.rfq === current.rfq &&
      fromRoute.pcmCalculationDate === current.pcmCalculationDate &&
      fromRoute.pcmQuantity === current.pcmQuantity
    );
  }
}
