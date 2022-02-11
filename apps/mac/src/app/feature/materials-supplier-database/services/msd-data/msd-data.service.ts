import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { DataFilter, DataResult } from '../../models';
import { environment } from './../../../../../environments/environment';
import { standardDocumentMaterialNumbers } from './../../constants/standard-document-material-numbers';
import { MaterialResponseEntry } from './../../models/data/material-response-entry.model';

@Injectable({
  providedIn: 'root',
})
export class MsdDataService {
  private readonly MSD_URL = '/materials-supplier-database/api/v1';

  private readonly BASE_URL = `${environment.baseUrl}${this.MSD_URL}`;

  constructor(private readonly httpClient: HttpClient) {}

  public getMaterialClasses(): Observable<DataFilter[]> {
    return this.httpClient
      .get<DataFilter[]>(`${this.BASE_URL}/materials/materialClasses`)
      .pipe(
        map((materialClasses: any[]) =>
          materialClasses.map((materialClass: any) => {
            const { code, ...newClass } = materialClass;

            return newClass;
          })
        )
      );
  }

  public getProductCategories(): Observable<DataFilter[]> {
    return this.httpClient
      .get<DataFilter[]>(`${this.BASE_URL}/materials/shapes`)
      .pipe(
        map((productCategories: any[]) =>
          productCategories.map((productCategory: any) => {
            const { code, ...newCategory } = productCategory;

            return newCategory;
          })
        )
      );
  }

  public getMaterials(
    materialClass?: number,
    shape?: number[]
  ): Observable<DataResult[]> {
    const params: { [key: string]: number | number[] | boolean } = {};
    if (materialClass) {
      params.materialClass = materialClass;
    }
    if (shape) {
      params.shape = shape.filter((id: number) => !!id);
    }
    // eslint-disable-next-line unicorn/no-useless-undefined
    if (!shape || shape?.includes(undefined)) {
      params.includeShapeNullValues = true;
      if (shape?.length === 1) {
        params.showOnlyNullValues = true;
      }
    }

    return this.httpClient
      .get<MaterialResponseEntry[]>(`${this.BASE_URL}/materials`, { params })
      .pipe(
        map((materialResponses: MaterialResponseEntry[]) =>
          materialResponses.map(
            (materialResponse: MaterialResponseEntry) =>
              ({
                id: materialResponse.id,
                manufacturerSupplierId:
                  materialResponse.manufacturerSupplier?.id,
                manufacturerSupplierName:
                  materialResponse.manufacturerSupplier?.name.trim(),
                manufacturerSupplierPlant:
                  materialResponse.manufacturerSupplier?.plant,
                manufacturerSupplierKind:
                  materialResponse.manufacturerSupplier?.kind === 1
                    ? 'Manufacturer'
                    : // eslint-disable-next-line unicorn/no-nested-ternary
                    materialResponse.manufacturerSupplier?.kind === 0
                    ? 'Supplier'
                    : undefined,
                materialStandardId: materialResponse.materialStandard?.id,
                materialStandardMaterialName:
                  materialResponse.materialStandard?.materialName,
                materialStandardStandardDocument:
                  materialResponse.materialStandard?.standardDocument,
                isPrematerial: materialResponse.isPrematerial,
                materialCategory: materialResponse.materialCategory,
                materialClassId: materialResponse.materialClass?.id,
                materialClassName: materialResponse.materialClass?.name,
                materialClassCode: materialResponse.materialClass?.code,
                shapeId: materialResponse.shape?.id,
                shapeName: materialResponse.shape?.name,
                shapeCode: materialResponse.shape?.code,
                castingMode: materialResponse.castingMode,
                castingDiameter: materialResponse.castingDiameter,
                minDimension: materialResponse.minDimension,
                maxDimension: materialResponse.maxDimension,
                co2PerTon: materialResponse.co2PerTon,
                ratingCode: materialResponse.rating?.code,
                ratingBarDiameter: materialResponse.rating?.barDiameter,
                ratingSquareDiameter: materialResponse.rating?.squareDiameter,
                ratingRemark: materialResponse.rating?.remark,
                ratingKindName: materialResponse.rating?.kind.name,
                ratingKindCode: materialResponse.rating?.kind.code,
                steelMakingProcess: materialResponse.steelMakingProcess,
                releaseDateYear: materialResponse.releaseDateYear,
                releaseDateMonth: materialResponse.releaseDateMonth,
                releaseRestrictions: materialResponse.releaseRestrictions,
                esr: materialResponse.esr,
                var: materialResponse.var,
                export: materialResponse.export,
                materialNumbers:
                  standardDocumentMaterialNumbers[
                    materialResponse.materialStandard.standardDocument
                  ] || undefined,
              } as DataResult)
          )
        )
      );
  }
}
