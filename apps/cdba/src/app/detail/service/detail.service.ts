import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../core/http/data.service';
import {
  BomIdentifier,
  BomItem,
  BomResult,
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../core/store/reducers/detail/models';
import { CalculationsResultModel } from '../../core/store/reducers/detail/models/calculations-result-model';
import { Calculation } from '../../core/store/reducers/shared/models/calculation.model';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  private readonly DETAIL = 'detail';

  private readonly CALCULATIONS = 'calculations';

  private readonly PARAM_MATERIAL_NUMBER = 'material-number';
  private readonly PARAM_PLANT = 'plant';

  private readonly BOM = 'bom';
  private readonly PARAM_BOM_COSTING_DATE = 'bom-costing-date';
  private readonly PARAM_BOM_COSTING_NUMBER = 'bom-costing-number';
  private readonly PARAM_BOM_COSTING_TYPE = 'bom-costing-type';
  private readonly PARAM_BOM_COSTING_VERSION = 'bom-costing-version';
  private readonly PARAM_BOM_ENTERED_MANUALLY = 'bom-entered-manually';
  private readonly PARAM_BOM_REFERENCE_OBJECT = 'bom-reference-object';
  private readonly PARAM_BOM_VALUATION_VARIANT = 'bom-valuation-variant';

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
            .find(
              (materialDesignations: string[]) =>
                materialDesignations.length === temp.length &&
                materialDesignations.every(
                  (value: string, index: number) => value === temp[index]
                )
            ) !== undefined
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

  public constructor(private readonly dataService: DataService) {}

  public detail(
    item: ReferenceTypeIdModel
  ): Observable<ReferenceTypeResultModel> {
    const params: HttpParams = new HttpParams()
      .set(this.PARAM_MATERIAL_NUMBER, item.materialNumber)
      .set(this.PARAM_PLANT, item.plant);

    return this.dataService.getAll<ReferenceTypeResultModel>(
      this.DETAIL,
      params
    );
  }

  public calculations(materialNumber: string): Observable<Calculation[]> {
    const params = new HttpParams().set(
      this.PARAM_MATERIAL_NUMBER,
      materialNumber
    );

    return this.dataService
      .getAll<CalculationsResultModel>(this.CALCULATIONS, params)
      .pipe(map((response: CalculationsResultModel) => response.items));
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

    return this.dataService.getAll<BomResult>(this.BOM, params).pipe(
      map((response: BomResult) =>
        response.items.map((item) => ({
          ...item,
          predecessorsInTree: [],
        }))
      ),
      map((items: BomItem[]) => DetailService.defineBomTreeForAgGrid(items, 0))
    );
  }
}
