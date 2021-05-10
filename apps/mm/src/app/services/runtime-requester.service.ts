import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { defer, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  BearinxDataTableDescription,
  BearinxExpressionDataType,
  BearinxExpressionType,
  Model,
  ModelObject,
  RuntimeRequester,
  TableCellType,
  TableColumnType,
} from '@caeonline/dynamic-forms';
import { withCache } from '@ngneat/cashew';

import { environment } from '../../environments/environment';
import {
  IDMM_BEARING_SEAT,
  IDMM_HYDRAULIC_NUT_TYPE,
  IDMM_INNER_RING_EXPANSION,
  IDMM_MODULUS_OF_ELASTICITY,
  IDMM_POISSON_RATIO,
  IDMM_RADIAL_CLEARANCE_REDUCTION,
  IDMM_SHAFT_MATERIAL,
  RSY_BEARING,
  RSY_BEARING_SERIES,
  RSY_BEARING_TYPE,
  TBL_BEARING_PREFLIGHT,
  TBL_SHAFT_MATERIAL,
} from '../shared/constants/dialog-constant';
import {
  MMBearingPreflightField,
  MMBearingPreflightResponse,
  MMBearingsMaterialResponse,
} from './lazy-list-loader.service';

@Injectable()
export class RuntimeRequesterService implements RuntimeRequester {
  constructor(private readonly http: HttpClient) {}

  getDataTable(
    _tableId: string,
    _model: Model,
    object: ModelObject,
    controlMap: Map<string, Map<string, FormGroup>>
  ): Observable<BearinxDataTableDescription> {
    if (_tableId === TBL_BEARING_PREFLIGHT) {
      return this.loadPreflight(object, controlMap);
    }

    if (_tableId === TBL_SHAFT_MATERIAL) {
      return this.loadShaftMaterials(object, controlMap);
    }

    return {} as Observable<BearinxDataTableDescription>;
  }

  private loadPreflight(
    object: ModelObject,
    controlMap: Map<string, Map<string, FormGroup>>
  ): Observable<BearinxDataTableDescription> {
    return defer(() => {
      return of({
        IDCO_DESIGNATION: controlMap.get(object.id)?.get(RSY_BEARING)?.value
          .value,
        IDMM_BEARING_SEAT: controlMap.get(object.id)?.get(IDMM_BEARING_SEAT)
          ?.value.value,
        RSY_BEARING_SERIES: controlMap.get(object.id)?.get(RSY_BEARING_SERIES)
          ?.value.value,
        RSY_BEARING_TYPE: controlMap.get(object.id)?.get(RSY_BEARING_TYPE)
          ?.value.value,
      });
    }).pipe(
      switchMap((body) =>
        this.http.post<MMBearingPreflightResponse>(
          `${environment.apiMMBaseUrl}${environment.preflightPath}`,
          body
        )
      ),
      map(({ data: { input } }) => {
        const allFields: MMBearingPreflightField[] = input.reduce(
          (inputs, { fields }) => [...inputs, ...fields],
          []
        );

        const nutType = allFields.find(
          ({ id }) => id === IDMM_HYDRAULIC_NUT_TYPE
        ).defaultValue;

        const innerRing = allFields.find(
          ({ id }) => id === IDMM_INNER_RING_EXPANSION
        ).defaultValue;

        const radialReduction = allFields.find(
          ({ id }) => id === IDMM_RADIAL_CLEARANCE_REDUCTION
        ).defaultValue;

        return {
          nutType,
          innerRing,
          radialReduction,
        };
      }),
      map(({ nutType, innerRing, radialReduction }) => ({
        columns: [
          { id: IDMM_HYDRAULIC_NUT_TYPE, type: TableColumnType.String },
          { id: IDMM_INNER_RING_EXPANSION, type: TableColumnType.Double },
          { id: IDMM_RADIAL_CLEARANCE_REDUCTION, type: TableColumnType.Double },
        ],
        rows: [
          {
            values: [
              {
                type: TableCellType.Expression,
                value: {
                  value: nutType,
                  dataType: BearinxExpressionDataType.String,
                  expressionType: BearinxExpressionType.Constant,
                },
              },
              {
                type: TableCellType.Expression,
                value: {
                  value: innerRing,
                  dataType: BearinxExpressionDataType.Number,
                  expressionType: BearinxExpressionType.Constant,
                },
              },
              {
                type: TableCellType.Expression,
                value: {
                  value: radialReduction,
                  dataType: BearinxExpressionDataType.Number,
                  expressionType: BearinxExpressionType.Constant,
                },
              },
            ],
          },
        ],
      }))
    );
  }

  private loadShaftMaterials(
    object: ModelObject,
    controlMap: Map<string, Map<string, FormGroup>>
  ): Observable<BearinxDataTableDescription> {
    return defer(() => {
      return of({
        IDMM_SHAFT_MATERIAL: controlMap.get(object.id)?.get(IDMM_SHAFT_MATERIAL)
          ?.value.value,
      });
    }).pipe(
      switchMap((body) => {
        return this.http.get<MMBearingsMaterialResponse>(
          `${environment.apiMMBaseUrl}${environment.materialsPath}${body.IDMM_SHAFT_MATERIAL}`,
          withCache()
        );
      }),
      map((input) => {
        return {
          modulusOfElasticy: input.IDMM_MODULUS_OF_ELASTICITY,
          poissonRatio: input.IDMM_POISSON_RATIO,
        };
      }),
      map(({ modulusOfElasticy, poissonRatio }) => ({
        columns: [
          { id: IDMM_MODULUS_OF_ELASTICITY, type: TableColumnType.String },
          { id: IDMM_POISSON_RATIO, type: TableColumnType.Double },
        ],
        rows: [
          {
            values: [
              {
                type: TableCellType.Expression,
                value: {
                  value: modulusOfElasticy,
                  dataType: BearinxExpressionDataType.String,
                  expressionType: BearinxExpressionType.Constant,
                },
              },
              {
                type: TableCellType.Expression,
                value: {
                  value: poissonRatio,
                  dataType: BearinxExpressionDataType.Number,
                  expressionType: BearinxExpressionType.Constant,
                },
              },
            ],
          },
        ],
      }))
    );
  }
}
