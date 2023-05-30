import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { withCache } from '@ngneat/cashew';

import { API, DetailPath } from '@cdba/shared/constants/api';
import {
  CostComponentSplit,
  Drawing,
  ReferenceType,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { BomIdentifier, BomItem } from '@cdba/shared/models/bom-item.model';

import { CalculationsResponse } from '../../core/store/reducers/detail/models';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  private readonly PARAM_LANGUAGE = 'language';

  private readonly PARAM_MATERIAL_NUMBER = 'material_number';
  private readonly PARAM_PLANT = 'plant';

  private readonly PARAM_COSTING_DATE = 'costing_date';
  private readonly PARAM_COSTING_NUMBER = 'costing_number';
  private readonly PARAM_COSTING_TYPE = 'costing_type';
  private readonly PARAM_VERSION = 'version';
  private readonly PARAM_ENTERED_MANUALLY = 'entered_manually';
  private readonly PARAM_REFERENCE_OBJECT = 'reference_object';
  private readonly PARAM_VALUATION_VARIANT = 'valuation_variant';

  public constructor(
    private readonly httpClient: HttpClient,
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage
  ) {}

  private static defineBomTreeForAgGrid(
    items: BomItem[],
    idx: number
  ): BomItem[] {
    if (idx === items.length) {
      return items;
    }

    const currentItem = items[idx];
    const nextIdx = idx + 1;

    // special case level 1
    if (currentItem.level === 1) {
      currentItem.predecessorsInTree = [currentItem.materialDesignation];

      return DetailService.defineBomTreeForAgGrid(items, nextIdx);
    }

    const previousItem = items[idx - 1];

    if (previousItem.level < currentItem.level) {
      // previous item is parent
      currentItem.predecessorsInTree = [
        ...previousItem.predecessorsInTree,
        currentItem.materialDesignation,
      ];
    } else {
      // previous item has same parent or different parent
      const itemsToRemove = previousItem.level - currentItem.level + 1;
      const predecessors = [...previousItem.predecessorsInTree];

      // remove last items to have the actual parent as last item
      predecessors.splice(predecessors.length - itemsToRemove, itemsToRemove);

      // since duplicates are possible, add spaces to the key until it is unique
      let foundUniqueKey = false;
      let currentMaterialDesignation = currentItem.materialDesignation;
      while (!foundUniqueKey) {
        const temp = [...predecessors, currentMaterialDesignation];

        if (
          items
            .map((item) => item.predecessorsInTree)
            .some(
              (materialDesignations: string[]) =>
                materialDesignations.length === temp.length &&
                materialDesignations.every(
                  (value: string, index: number) => value === temp[index]
                )
            )
        ) {
          currentMaterialDesignation += ' ';
        } else {
          foundUniqueKey = true;
        }
      }

      currentItem.predecessorsInTree = [
        ...predecessors,
        currentMaterialDesignation,
      ];
    }

    return DetailService.defineBomTreeForAgGrid(items, nextIdx);
  }

  public getDetails(item: ReferenceTypeIdentifier): Observable<ReferenceType> {
    const params: HttpParams = new HttpParams()
      .set(this.PARAM_MATERIAL_NUMBER, item.materialNumber)
      .set(this.PARAM_PLANT, item.plant)
      .set(this.PARAM_LANGUAGE, this.localStorage.getItem('language'));

    const path = `${API.v2}/${DetailPath.Detail}`;

    return this.httpClient.get<ReferenceType>(path, {
      params,
      context: withCache(),
    });
  }

  public getCalculations(
    materialNumber: string,
    plant: string
  ): Observable<CalculationsResponse> {
    const params = new HttpParams()
      .set(this.PARAM_MATERIAL_NUMBER, materialNumber)
      .set(this.PARAM_PLANT, plant);

    return this.httpClient.get<CalculationsResponse>(
      `${API.v2}/${DetailPath.Calculations}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  public getBom(bomIdentifier: BomIdentifier): Observable<BomItem[]> {
    const path = `${API.v2}/${DetailPath.Bom}`;

    const params: HttpParams = new HttpParams()
      .set(this.PARAM_COSTING_DATE, bomIdentifier.costingDate)
      .set(this.PARAM_COSTING_NUMBER, bomIdentifier.costingNumber)
      .set(this.PARAM_COSTING_TYPE, bomIdentifier.costingType)
      .set(this.PARAM_VERSION, bomIdentifier.version)
      .set(this.PARAM_ENTERED_MANUALLY, false)
      .set(this.PARAM_REFERENCE_OBJECT, bomIdentifier.referenceObject)
      .set(this.PARAM_VALUATION_VARIANT, bomIdentifier.valuationVariant);

    return this.httpClient
      .get<BomItem[]>(path, {
        params,
        context: withCache(),
      })
      .pipe(
        map((response: any) => response),
        map((items) =>
          items.map((item: any) => ({
            ...item,
            predecessorsInTree: [],
          }))
        ),
        map((items: BomItem[]) =>
          DetailService.defineBomTreeForAgGrid(items, 0)
        )
      );
  }

  public getCostComponentSplit(
    bomIdentifier: BomIdentifier
  ): Observable<CostComponentSplit[]> {
    const path = `${API.v1}/${DetailPath.CostComponentSplit}`;

    const params: HttpParams = new HttpParams()
      .set(this.PARAM_COSTING_DATE, bomIdentifier.costingDate)
      .set(this.PARAM_COSTING_NUMBER, bomIdentifier.costingNumber)
      .set(this.PARAM_COSTING_TYPE, bomIdentifier.costingType)
      .set(this.PARAM_VERSION, bomIdentifier.version)
      .set(this.PARAM_ENTERED_MANUALLY, bomIdentifier.enteredManually)
      .set(this.PARAM_REFERENCE_OBJECT, bomIdentifier.referenceObject)
      .set(this.PARAM_VALUATION_VARIANT, bomIdentifier.valuationVariant);

    return this.httpClient
      .get<CostComponentSplit[]>(path, {
        params,
        context: withCache(),
      })
      .pipe(
        map((items) => {
          let sumTotalValue = 0;
          let sumVariableValue = 0;
          let sumFixedValue = 0;

          // only compute if split type "total" is not included in an array
          // this way we know the response is not cached
          if (!items.some((el) => el.splitType === 'TOTAL')) {
            items.forEach((item) => {
              if (item.splitType === 'MAIN') {
                sumTotalValue += item.totalValue;
                sumVariableValue += item.variableValue;
                sumFixedValue += item.fixedValue;
              }
            });

            items.push({
              costComponent: undefined,
              description: undefined,
              splitType: 'TOTAL',
              totalValue: sumTotalValue,
              fixedValue: sumFixedValue,
              variableValue: sumVariableValue,
              currency: items[0]?.currency,
            });
          }

          return items;
        })
      );
  }

  public getDrawings(
    materialNumber: string,
    plant: string
  ): Observable<Drawing[]> {
    const params = new HttpParams()
      .set(this.PARAM_MATERIAL_NUMBER, materialNumber)
      .set(this.PARAM_PLANT, plant);

    return this.httpClient.get<Drawing[]>(`${API.v1}/${DetailPath.Drawings}`, {
      params,
      context: withCache(),
    });
  }
}
