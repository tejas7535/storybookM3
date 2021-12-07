import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API, DetailPath } from '@cdba/shared/constants/api';
import {
  BomIdentifier,
  BomItem,
  Calculation,
  Drawing,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { withCache } from '@ngneat/cashew';

import {
  BomResult,
  CalculationsResult,
  ReferenceTypeResult,
} from '../../core/store/reducers/detail/models';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  private readonly PARAM_MATERIAL_NUMBER = 'material_number';
  private readonly PARAM_PLANT = 'plant';
  private readonly PARAM_IDENTIFICATION_HASH = 'identification_hash';

  private readonly PARAM_BOM_COSTING_DATE = 'bom_costing_date';
  private readonly PARAM_BOM_COSTING_NUMBER = 'bom_costing_number';
  private readonly PARAM_BOM_COSTING_TYPE = 'bom_costing_type';
  private readonly PARAM_BOM_COSTING_VERSION = 'bom_costing_version';
  private readonly PARAM_BOM_ENTERED_MANUALLY = 'bom_entered_manually';
  private readonly PARAM_BOM_REFERENCE_OBJECT = 'bom_reference_object';
  private readonly PARAM_BOM_VALUATION_VARIANT = 'bom_valuation_variant';

  public constructor(private readonly httpClient: HttpClient) {}

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

  public getDetails(
    item: ReferenceTypeIdentifier
  ): Observable<ReferenceTypeResult> {
    const params: HttpParams = new HttpParams()
      .set(this.PARAM_MATERIAL_NUMBER, item.materialNumber)
      .set(this.PARAM_PLANT, item.plant);

    const path = `${API.v1}/${DetailPath.Detail}?${params.toString()}&${
      this.PARAM_IDENTIFICATION_HASH
    }=${encodeURIComponent(item.identificationHash)}`;

    return this.httpClient.get<ReferenceTypeResult>(path, {
      context: withCache(),
    });
  }

  public getCalculations(
    materialNumber: string,
    plant: string
  ): Observable<Calculation[]> {
    const params = new HttpParams()
      .set(this.PARAM_MATERIAL_NUMBER, materialNumber)
      .set(this.PARAM_PLANT, plant);

    return this.httpClient
      .get<CalculationsResult>(`${API.v1}/${DetailPath.Calculations}`, {
        params,
        context: withCache(),
      })
      .pipe(map((response: CalculationsResult) => response.items));
  }

  public getBom(bomIdentifier: BomIdentifier): Observable<BomItem[]> {
    const params = new HttpParams()
      .set(this.PARAM_BOM_COSTING_DATE, bomIdentifier.bomCostingDate)
      .set(this.PARAM_BOM_COSTING_NUMBER, bomIdentifier.bomCostingNumber)
      .set(this.PARAM_BOM_COSTING_TYPE, bomIdentifier.bomCostingType)
      .set(this.PARAM_BOM_COSTING_VERSION, bomIdentifier.bomCostingVersion)
      .set(this.PARAM_BOM_ENTERED_MANUALLY, bomIdentifier.bomEnteredManually)
      .set(this.PARAM_BOM_REFERENCE_OBJECT, bomIdentifier.bomReferenceObject)
      .set(this.PARAM_BOM_VALUATION_VARIANT, bomIdentifier.bomValuationVariant);

    return this.httpClient
      .get<BomResult>(`${API.v1}/${DetailPath.Bom}`, {
        params,
        context: withCache(),
      })
      .pipe(
        map((response: BomResult) =>
          response.items.map((item) => ({
            ...item,
            predecessorsInTree: [],
          }))
        ),
        map((items: BomItem[]) =>
          DetailService.defineBomTreeForAgGrid(items, 0)
        )
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
