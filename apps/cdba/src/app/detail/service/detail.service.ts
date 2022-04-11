import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API, DetailPath } from '@cdba/shared/constants/api';
import { BetaFeature } from '@cdba/shared/constants/beta-feature';
import {
  BomIdentifier,
  BomItem,
  Drawing,
  ReferenceType,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { BomItemOdata } from '@cdba/shared/models/bom-item-odata.model';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import { withCache } from '@ngneat/cashew';

import {
  BomResult,
  CalculationsResponse,
} from '../../core/store/reducers/detail/models';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  private readonly PARAM_MATERIAL_NUMBER = 'material_number';
  private readonly PARAM_PLANT = 'plant';

  private readonly PARAM_BOM_COSTING_DATE = 'bom_costing_date';
  private readonly PARAM_BOM_COSTING_NUMBER = 'bom_costing_number';
  private readonly PARAM_BOM_COSTING_TYPE = 'bom_costing_type';
  private readonly PARAM_BOM_COSTING_VERSION = 'bom_costing_version';
  private readonly PARAM_BOM_ENTERED_MANUALLY = 'bom_entered_manually';
  private readonly PARAM_BOM_REFERENCE_OBJECT = 'bom_reference_object';
  private readonly PARAM_BOM_VALUATION_VARIANT = 'bom_valuation_variant';

  private readonly PARAM_COSTING_DATE = 'costing_date';
  private readonly PARAM_COSTING_NUMBER = 'costing_number';
  private readonly PARAM_COSTING_TYPE = 'costing_type';
  private readonly PARAM_VERSION = 'version';
  private readonly PARAM_ENTERED_MANUALLY = 'entered_manually';
  private readonly PARAM_REFERENCE_OBJECT = 'reference_object';
  private readonly PARAM_VALUATION_VARIANT = 'valuation_variant';

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly betaFeatureService: BetaFeatureService
  ) {}

  private static defineBomTreeForAgGrid(
    items: BomItem[] | BomItemOdata[],
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
      .set(this.PARAM_PLANT, item.plant);

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

  public getBom(
    bomIdentifier: BomIdentifier
  ): Observable<BomItem[] | BomItemOdata[]> {
    const odataEnabled = this.betaFeatureService.getBetaFeature(
      BetaFeature.O_DATA
    );

    const path = `${odataEnabled ? API.v2 : API.v1}/${DetailPath.Bom}`;

    const params: HttpParams = odataEnabled
      ? new HttpParams()
          .set(this.PARAM_COSTING_DATE, bomIdentifier.bomCostingDate)
          .set(this.PARAM_COSTING_NUMBER, bomIdentifier.bomCostingNumber)
          .set(this.PARAM_COSTING_TYPE, bomIdentifier.bomCostingType)
          .set(this.PARAM_VERSION, bomIdentifier.bomCostingVersion)
          .set(this.PARAM_ENTERED_MANUALLY, false)
          .set(this.PARAM_REFERENCE_OBJECT, bomIdentifier.bomReferenceObject)
          .set(this.PARAM_VALUATION_VARIANT, bomIdentifier.bomValuationVariant)
      : new HttpParams()
          .set(this.PARAM_BOM_COSTING_DATE, bomIdentifier.bomCostingDate)
          .set(this.PARAM_BOM_COSTING_NUMBER, bomIdentifier.bomCostingNumber)
          .set(this.PARAM_BOM_COSTING_TYPE, bomIdentifier.bomCostingType)
          .set(this.PARAM_BOM_COSTING_VERSION, bomIdentifier.bomCostingVersion)
          .set(
            this.PARAM_BOM_ENTERED_MANUALLY,
            bomIdentifier.bomEnteredManually
          )
          .set(
            this.PARAM_BOM_REFERENCE_OBJECT,
            bomIdentifier.bomReferenceObject
          )
          .set(
            this.PARAM_BOM_VALUATION_VARIANT,
            bomIdentifier.bomValuationVariant
          );

    return this.httpClient
      .get<BomResult | BomItemOdata[]>(path, {
        params,
        context: withCache(),
      })
      .pipe(
        map((response: any) => (odataEnabled ? response : response.items)),
        map((items) =>
          items.map((item: any) => ({
            ...item,
            predecessorsInTree: [],
          }))
        ),
        map((items: BomItem[] | BomItemOdata[]) =>
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
