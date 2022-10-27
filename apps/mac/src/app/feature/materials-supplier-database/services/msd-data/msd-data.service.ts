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
      params.category = category.filter(Boolean);
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
                selfCertified: materialResponse.selfCertified,
                manufacturer:
                  materialResponse.manufacturerSupplier.manufacturer,
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
                co2Classification: materialResponse.co2Classification,
                releaseDateYear: materialResponse.releaseDateYear,
                releaseDateMonth: materialResponse.releaseDateMonth,
                releaseRestrictions: materialResponse.releaseRestrictions,
                blocked: materialResponse.blocked,
                castingMode: materialResponse.castingMode,
                castingDiameter: materialResponse.castingDiameter,
                minDimension: materialResponse.minDimension,
                maxDimension: materialResponse.maxDimension,
                steelMakingProcess: materialResponse.steelMakingProcess,
                rating: materialResponse.rating,
                ratingRemark: materialResponse.ratingRemark,
                ratingChangeComment: materialResponse.ratingChangeComment,
                lastModified: materialResponse.timestamp,
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

  public fetchReferenceDocuments(materialStandardId: number) {
    const body = {
      select: ['referenceDoc'],
      where: [
        {
          col: 'materialStandard.id',
          op: 'IN',
          values: [materialStandardId.toString()],
        },
      ],
      distinct: true,
    };

    return this.httpClient.post<string[]>(
      `${this.BASE_URL}/materials/query`,
      body
    );
  }

  public fetchStandardDocumentsForMaterialName(materialName: string) {
    const body = {
      select: ['materialStandard.id', 'materialStandard.standardDocument'],
      where: [
        {
          col: 'materialStandard.materialName',
          op: 'IN',
          values: [materialName],
        },
      ],
      distinct: true,
    };

    return this.httpClient.post<[number, string][]>(
      `${this.BASE_URL}/materials/query`,
      body
    );
  }

  public fetchManufacturerSuppliersForSupplierName(supplierName: string) {
    const body = {
      select: ['manufacturerSupplier.id'],
      where: [
        {
          col: 'manufacturerSupplier.name',
          op: 'IN',
          values: [supplierName],
        },
      ],
      distinct: true,
    };

    return this.httpClient.post<number[]>(
      `${this.BASE_URL}/materials/query`,
      body
    );
  }

  public fetchMaterialNamesForStandardDocuments(standardDocument: string) {
    const body = {
      select: ['materialStandard.id', 'materialStandard.materialName'],
      where: [
        {
          col: 'materialStandard.standardDocument',
          op: 'IN',
          values: [standardDocument],
        },
      ],
      distinct: true,
    };

    return this.httpClient.post<[number, string][]>(
      `${this.BASE_URL}/materials/query`,
      body
    );
  }

  public fetchSteelMakingProcessesForSupplierPlantCastingModeCastingDiameter(
    supplierId: number,
    castingMode: string,
    castingDiameter: string
  ) {
    const body = {
      select: ['steelMakingProcess'],
      where: [
        {
          col: 'manufacturerSupplier.id',
          op: 'IN',
          values: [supplierId],
        },
        {
          col: 'castingMode',
          op: 'IN',
          values: [castingMode],
        },
        {
          col: 'castingDiameter',
          op: 'IN',
          values: [castingDiameter],
        },
      ],
      distinct: true,
    };

    return this.httpClient
      .post<string[]>(`${this.BASE_URL}/materials/query`, body)
      .pipe(
        map((steelMakingProcesses) =>
          steelMakingProcesses.filter(
            (steelMakingProcess) => !!steelMakingProcess
          )
        )
      );
  }

  public fetchCo2ValuesForSupplierPlantProcess(
    supplierId: number,
    steelMakingProcess: string
  ) {
    const body = {
      select: [
        'co2PerTon',
        'co2Scope1',
        'co2Scope2',
        'co2Scope3',
        'co2Classification',
      ],
      where: [
        {
          col: 'manufacturerSupplier.id',
          op: 'IN',
          values: [supplierId],
        },
        {
          col: 'steelMakingProcess',
          op: 'IN',
          values: [steelMakingProcess],
        },
      ],
      distinct: true,
    };

    return this.httpClient
      .post<[number, number, number, number, string][]>(
        `${this.BASE_URL}/materials/query`,
        body
      )
      .pipe(
        map((co2Values) => co2Values.filter(Boolean)),
        map((co2Values) =>
          co2Values.map((co2Value) => ({
            co2PerTon: co2Value[0],
            co2Scope1: co2Value[1],
            co2Scope2: co2Value[2],
            co2Scope3: co2Value[3],
            co2Classification: co2Value[4],
          }))
        )
      );
  }

  public createMaterialStandard(standard: MaterialStandard) {
    const modStd = {
      materialName: standard.materialName,
      standardDocument: standard.standardDocument,
      materialNumber: standard.materialNumber?.split(', '),
    };

    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials/materialStandards`,
      modStd
    );
  }

  public createManufacturerSupplier(supplier: ManufacturerSupplier) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials/manufacturerSuppliers`,
      supplier
    );
  }

  public createMaterial(material: Material) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials`,
      material
    );
  }
}
