import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

import { environment } from '@mac/environments/environment';
import {
  DataResult,
  ManufacturerSupplier,
  Material,
  MaterialResponseEntry,
  MaterialStandard,
} from '@mac/msd/models';

@Injectable({
  providedIn: 'root',
})
export class MsdDataService {
  private readonly MSD_URL = '/materials-supplier-database/api/v2';

  private readonly BASE_URL = `${environment.baseUrl}${this.MSD_URL}`;

  constructor(private readonly httpClient: HttpClient) {}

  public getMaterialClasses() {
    return this.httpClient
      .get<string[]>(`${this.BASE_URL}/materials/materialClasses`)
      .pipe(
        map((materialClasses) =>
          materialClasses.map(
            (materialClass) =>
              ({
                id: materialClass,
                title: translate(
                  `materialsSupplierDatabase.materialClassValues.${materialClass}`
                ),
              } as StringOption)
          )
        )
      );
  }

  public getProductCategories() {
    return this.httpClient
      .get<string[]>(`${this.BASE_URL}/materials/productCategories`)
      .pipe(
        map((productCategories) =>
          productCategories.map(
            (productCategory) =>
              ({
                id: productCategory,
                title: translate(
                  `materialsSupplierDatabase.productCategoryValues.${productCategory}`
                ),
              } as StringOption)
          )
        )
      );
  }

  public getMaterials(materialClass?: string, category?: string[]) {
    const params: { materialClass?: string; category?: string[] } = {};
    if (materialClass) {
      params.materialClass = materialClass;
    }
    if (category) {
      params.category = category.filter((id) => !!id);
    }

    return this.httpClient
      .get<MaterialResponseEntry[]>(`${this.BASE_URL}/materials`, { params })
      .pipe(
        map((materialResponses: MaterialResponseEntry[]) =>
          materialResponses.map(
            (materialResponse: MaterialResponseEntry) =>
              ({
                id: materialResponse.id,
                materialClass: materialResponse.materialClass,
                materialClassText: translate(
                  `materialsSupplierDatabase.materialClassValues.${materialResponse.materialClass}`
                ),
                materialStandardId: materialResponse.materialStandard.id,
                materialStandardMaterialName:
                  materialResponse.materialStandard.materialName,
                materialNumbers:
                  materialResponse.materialStandard.materialNumber?.includes(
                    ','
                  )
                    ? materialResponse.materialStandard.materialNumber
                        ?.split(',')
                        .map((materialNumber) => materialNumber.trim())
                    : [materialResponse.materialStandard.materialNumber],
                materialStandardStandardDocument:
                  materialResponse.materialStandard.standardDocument,
                manufacturerSupplierId:
                  materialResponse.manufacturerSupplier.id,
                manufacturerSupplierName:
                  materialResponse.manufacturerSupplier.name,
                manufacturerSupplierPlant:
                  materialResponse.manufacturerSupplier.plant,
                sapSupplierIds:
                  materialResponse.manufacturerSupplier.sapData?.map(
                    (sapData) => sapData.sapSupplierId
                  ) || [],
                productCategory: materialResponse.productCategory,
                productCategoryText: translate(
                  `materialsSupplierDatabase.productCategoryValues.${materialResponse.productCategory}`
                ),
                referenceDoc: materialResponse.referenceDoc,
                co2Scope1: materialResponse.co2Scope1,
                co2Scope2: materialResponse.co2Scope2,
                co2Scope3: materialResponse.co2Scope3,
                co2PerTon: materialResponse.co2PerTon,
                releaseDateYear: materialResponse.releaseDateYear,
                releaseDateMonth: materialResponse.releaseDateMonth,
                releaseRestrictions: materialResponse.releaseRestrictions,
                castingMode: materialResponse.castingMode,
                castingDiameter: materialResponse.castingDiameter,
                minDimension: materialResponse.minDimension,
                maxDimension: materialResponse.maxDimension,
                steelMakingProcess: materialResponse.steelMakingProcess,
                rating: materialResponse.rating,
                ratingRemark: materialResponse.ratingRemark,
              } as DataResult)
          )
        )
      );
  }

  public fetchManufacturerSuppliers() {
    return this.httpClient.get<ManufacturerSupplier[]>(
      `${this.BASE_URL}/materials/manufacturerSuppliers`
    );
  }

  public fetchMaterialStandards() {
    return this.httpClient.get<MaterialStandard[]>(
      `${this.BASE_URL}/materials/materialStandards`
    );
  }

  public fetchRatings() {
    return this.httpClient.get<string[]>(`${this.BASE_URL}/materials/ratings`);
  }

  public fetchSteelMakingProcesses() {
    return this.httpClient.get<string[]>(
      `${this.BASE_URL}/materials/steelMakingProcesses`
    );
  }

  public fetchCo2Classifications() {
    return this.httpClient
      .get<string[]>(`${this.BASE_URL}/materials/co2Classifications`)
      .pipe(
        map((co2Classifications) =>
          co2Classifications.map(
            (co2Classification) =>
              ({
                id: co2Classification,
                title: translate(
                  `materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.${co2Classification.toLowerCase()}`
                ),
              } as StringOption)
          )
        )
      );
  }

  public fetchCastingModes() {
    return this.httpClient.get<string[]>(
      `${this.BASE_URL}/materials/castingModes`
    );
  }

  public fetchCastingDiameters(supplierId: number, castingMode: string) {
    const body = {
      select: ['castingDiameter'],
      where: [
        {
          col: 'manufacturerSupplier.id',
          op: 'IN',
          values: [supplierId.toString()],
        },
        {
          col: 'castingMode',
          op: 'LIKE',
          values: [castingMode],
        },
      ],
      distinct: true,
    };

    return this.httpClient.post<string[]>(
      `${this.BASE_URL}/materials/query`,
      body
    );
  }

  public createMaterial(material: Material) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials`,
      material
    );
  }
}
