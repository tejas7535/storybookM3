/* eslint-disable max-lines */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

import { environment } from '@mac/environments/environment';
import { MaterialClass } from '@mac/msd/constants';
import {
  ManufacturerSupplierTableValue,
  ManufacturerSupplierV2,
  Material,
  MaterialRequest,
  MaterialResponse,
  MaterialStandardTableValue,
  MaterialStandardV2,
  MaterialV2,
} from '@mac/msd/models';

@Injectable({
  providedIn: 'root',
})
export class MsdDataService {
  private readonly MSD_URL = '/materials-supplier-database/api/';

  private readonly BASE_URL = `${environment.baseUrl}${this.MSD_URL}v3`;

  private readonly TOOLTIP_DELAY = 1500;

  constructor(private readonly httpClient: HttpClient) {}

  public getMaterialClasses() {
    return this.httpClient
      .get<string[]>(`${this.BASE_URL}/materials/materialClasses`)
      .pipe(map((materialClasses) => materialClasses as MaterialClass[]));
  }

  public getProductCategories(materialClass: MaterialClass) {
    return this.httpClient
      .get<string[]>(
        `${this.BASE_URL}/materials/${materialClass}/productCategories`
      )
      .pipe(
        map((productCategories) =>
          productCategories.map((productCategory) => {
            const title = translate(
              `materialsSupplierDatabase.productCategoryValues.${productCategory}`
            );

            return {
              id: productCategory,
              tooltipDelay: this.TOOLTIP_DELAY,
              tooltip: title,
              title,
            } as StringOption;
          })
        )
      );
  }

  public getMaterials<T extends MaterialV2 = MaterialV2>(
    materialClass: string,
    category?: string[]
  ): Observable<MaterialV2[]> {
    const params: { category?: string[] } = category
      ? { category: category.filter(Boolean) }
      : {};

    return this.httpClient
      .get<MaterialResponse[]>(`${this.BASE_URL}/materials/${materialClass}`, {
        params,
      })
      .pipe(
        map((materialResponses: MaterialResponse[]) =>
          materialResponses.map((materialResponse: MaterialResponse) =>
            this.mapMaterials<T>(materialResponse)
          )
        )
      );
  }

  public getHistoryForMaterial<T extends MaterialV2 = MaterialV2>(
    materialClass: string,
    id: number
  ): Observable<MaterialV2[]> {
    return this.httpClient
      .get<MaterialResponse[]>(
        `${this.BASE_URL}/materials/${materialClass}/history/${id}`,
        {
          params: { current: true },
        }
      )
      .pipe(
        map((materialResponses: MaterialResponse[]) =>
          materialResponses.map((materialResponse: MaterialResponse) =>
            this.mapMaterials<T>(materialResponse)
          )
        )
      );
  }

  // eslint-disable-next-line complexity
  private mapMaterials<T extends MaterialV2 = MaterialV2>(
    materialResponse: MaterialResponse
  ): T {
    return {
      id: materialResponse.id,
      materialStandardId: materialResponse.materialStandard.id,
      materialStandardMaterialName:
        materialResponse.materialStandard.materialName,
      materialNumbers:
        'materialNumber' in materialResponse.materialStandard
          ? materialResponse.materialStandard.materialNumber
          : undefined,
      materialStandardStandardDocument:
        materialResponse.materialStandard.standardDocument,
      manufacturerSupplierId: materialResponse.manufacturerSupplier.id,
      manufacturerSupplierName: materialResponse.manufacturerSupplier.name,
      manufacturerSupplierPlant: materialResponse.manufacturerSupplier.plant,
      manufacturerSupplierCountry:
        materialResponse.manufacturerSupplier.country,
      materialClass: materialResponse.materialClass as MaterialClass,
      selfCertified:
        'selfCertified' in materialResponse
          ? materialResponse.selfCertified
          : undefined,
      manufacturer:
        'manufacturer' in materialResponse.manufacturerSupplier
          ? materialResponse.manufacturerSupplier.manufacturer
          : undefined,
      sapSupplierIds:
        'sapData' in materialResponse.manufacturerSupplier
          ? materialResponse.manufacturerSupplier.sapData?.map(
              (sapData: { sapSupplierId: string }) => sapData.sapSupplierId
            ) || []
          : undefined,
      productCategory:
        'productCategory' in materialResponse
          ? materialResponse.productCategory
          : undefined,
      productCategoryText:
        'productCategory' in materialResponse
          ? translate(
              `materialsSupplierDatabase.productCategoryValues.${materialResponse.productCategory}`
            )
          : undefined,
      ssid: 'ssid' in materialResponse ? materialResponse.ssid : undefined,
      generalDescription:
        'generalDescription' in materialResponse
          ? materialResponse.generalDescription
          : undefined,
      referenceDoc:
        'referenceDoc' in materialResponse
          ? materialResponse.referenceDoc
          : undefined,
      co2Scope1: materialResponse.co2Scope1,
      co2Scope2: materialResponse.co2Scope2,
      co2Scope3: materialResponse.co2Scope3,
      co2PerTon: materialResponse.co2PerTon,
      co2Classification: materialResponse.co2Classification,
      releaseDateYear:
        'releaseDateYear' in materialResponse
          ? materialResponse.releaseDateYear
          : undefined,
      releaseDateMonth:
        'releaseDateMonth' in materialResponse
          ? materialResponse.releaseDateMonth
          : undefined,
      releaseRestrictions: materialResponse.releaseRestrictions,
      blocked:
        'blocked' in materialResponse ? materialResponse.blocked : undefined,
      castingMode:
        'castingMode' in materialResponse
          ? materialResponse.castingMode
          : undefined,
      castingDiameter:
        'castingDiameter' in materialResponse
          ? materialResponse.castingDiameter
          : undefined,
      minDimension:
        'minDimension' in materialResponse
          ? materialResponse.minDimension
          : undefined,
      maxDimension:
        'maxDimension' in materialResponse
          ? materialResponse.maxDimension
          : undefined,
      steelMakingProcess:
        'steelMakingProcess' in materialResponse
          ? materialResponse.steelMakingProcess
          : undefined,
      productionProcess:
        'productionProcess' in materialResponse
          ? materialResponse.productionProcess
          : undefined,
      productionProcessText:
        'productionProcess' in materialResponse &&
        materialResponse.productionProcess
          ? translate(
              `materialsSupplierDatabase.productionProcessValues.${materialResponse.productionProcess}`
            )
          : undefined,
      recyclingRate:
        'recyclingRate' in materialResponse
          ? materialResponse.recyclingRate
          : undefined,
      rating:
        'rating' in materialResponse ? materialResponse.rating : undefined,
      ratingRemark:
        'ratingRemark' in materialResponse
          ? materialResponse.ratingRemark
          : undefined,
      ratingChangeComment:
        'ratingChangeComment' in materialResponse
          ? materialResponse.ratingChangeComment
          : undefined,
      lastModified: materialResponse.timestamp,
      modifiedBy: materialResponse.modifiedBy,
    } as unknown as T;
  }

  public fetchManufacturerSuppliers(materialClass: MaterialClass) {
    return this.httpClient.get<ManufacturerSupplierV2[]>(
      `${this.BASE_URL}/materials/${materialClass}/manufacturerSuppliers`
    );
  }

  public getHistoryForManufacturerSupplier(
    materialClass: MaterialClass,
    id: number
  ) {
    return this.httpClient.get<ManufacturerSupplierV2[]>(
      `${this.BASE_URL}/materials/${materialClass}/history/manufacturerSuppliers/${id}`,
      {
        params: { current: true },
      }
    );
  }

  public mapSuppliersToTableView(
    suppliers: ManufacturerSupplierV2[]
  ): ManufacturerSupplierTableValue[] {
    return suppliers.map((supplier) => this.mapSuppliers(supplier));
  }

  private mapSuppliers(
    manufacturerSupplier: ManufacturerSupplierV2
  ): ManufacturerSupplierTableValue {
    return {
      id: manufacturerSupplier.id,
      manufacturerSupplierName: manufacturerSupplier.name,
      manufacturerSupplierPlant: manufacturerSupplier.plant,
      manufacturerSupplierCountry: manufacturerSupplier.country,
      manufacturer:
        'manufacturer' in manufacturerSupplier
          ? manufacturerSupplier.manufacturer
          : undefined,
      sapSupplierIds:
        'sapData' in manufacturerSupplier
          ? manufacturerSupplier.sapData?.map(
              (sapData: { sapSupplierId: string }) => sapData.sapSupplierId
            ) || []
          : undefined,
      lastModified: manufacturerSupplier.timestamp,
      modifiedBy: manufacturerSupplier.modifiedBy,
    } as ManufacturerSupplierTableValue;
  }

  public fetchMaterialStandards(materialClass: MaterialClass) {
    return this.httpClient.get<MaterialStandardV2[]>(
      `${this.BASE_URL}/materials/${materialClass}/materialStandards`
    );
  }

  public getHistoryForMaterialStandard(
    materialClass: MaterialClass,
    id: number
  ) {
    return this.httpClient.get<MaterialStandardV2[]>(
      `${this.BASE_URL}/materials/${materialClass}/history/materialStandards/${id}`,
      {
        params: { current: true },
      }
    );
  }

  public mapStandardsToTableView(
    standards: MaterialStandardV2[]
  ): MaterialStandardTableValue[] {
    return standards.map((std) => this.mapStandards(std));
  }

  private mapStandards(std: MaterialStandardV2): MaterialStandardTableValue {
    return {
      id: std.id,
      materialStandardMaterialName: std.materialName,
      materialStandardStandardDocument: std.standardDocument,
      materialNumbers: 'materialNumber' in std ? std.materialNumber : undefined,
      lastModified: std.timestamp,
      modifiedBy: std.modifiedBy,
    } as MaterialStandardTableValue;
  }

  public fetchRatings() {
    return this.httpClient.get<string[]>(
      `${this.BASE_URL}/materials/st/ratings`
    );
  }

  public fetchSteelMakingProcesses() {
    return this.httpClient.get<string[]>(
      `${this.BASE_URL}/materials/st/steelMakingProcesses`
    );
  }

  public fetchProductionProcesses(materialClass: MaterialClass) {
    return this.httpClient
      .get<string[]>(
        `${this.BASE_URL}/materials/${materialClass}/productionProcesses`
      )
      .pipe(
        map((processes) =>
          processes.map((process) => {
            const title = translate(
              `materialsSupplierDatabase.productionProcessValues.${process}`
            );

            return {
              id: process,
              tooltipDelay: this.TOOLTIP_DELAY,
              tooltip: title,
              title,
            } as StringOption;
          })
        )
      );
  }

  public fetchCo2Classifications(_materialClass: MaterialClass) {
    return this.httpClient
      .get<string[]>(`${this.BASE_URL}/materials/st/co2Classifications`)
      .pipe(
        map((co2Classifications) =>
          co2Classifications.map((co2Classification) => {
            const title = translate(
              `materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.${co2Classification.toLowerCase()}`
            );

            return {
              id: co2Classification,
              tooltipDelay: this.TOOLTIP_DELAY,
              tooltip: title,
              title,
            } as StringOption;
          })
        )
      );
  }

  public fetchCastingModes(materialClass: MaterialClass) {
    return this.httpClient.get<string[]>(
      `${this.BASE_URL}/materials/${materialClass}/castingModes`
    );
  }

  public fetchCastingDiameters(
    supplierId: number,
    castingMode: string,
    materialClass: MaterialClass
  ) {
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
      `${this.BASE_URL}/materials/${materialClass}/query`,
      body
    );
  }

  public fetchReferenceDocuments(
    materialStandardId: number,
    materialClass: MaterialClass
  ) {
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
      `${this.BASE_URL}/materials/${materialClass}/query`,
      body
    );
  }

  public fetchStandardDocumentsForMaterialName(
    materialName: string,
    materialClass: MaterialClass
  ) {
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
      `${this.BASE_URL}/materials/${materialClass}/query`,
      body
    );
  }

  public fetchManufacturerSuppliersForSupplierName(
    supplierName: string,
    materialClass: MaterialClass
  ) {
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
      `${this.BASE_URL}/materials/${materialClass}/query`,
      body
    );
  }

  public fetchMaterialNamesForStandardDocuments(
    standardDocument: string,
    materialClass: MaterialClass
  ) {
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
      `${this.BASE_URL}/materials/${materialClass}/query`,
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
      .post<string[]>(`${this.BASE_URL}/materials/st/query`, body)
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
    materialClass: MaterialClass,
    steelMakingProcess?: string
  ) {
    const where = steelMakingProcess
      ? [
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
        ]
      : [
          {
            col: 'manufacturerSupplier.id',
            op: 'IN',
            values: [supplierId],
          },
        ];
    const body = {
      select: [
        'co2PerTon',
        'co2Scope1',
        'co2Scope2',
        'co2Scope3',
        'co2Classification',
      ],
      distinct: true,
      where,
    };

    return this.httpClient
      .post<[number, number, number, number, string][]>(
        `${this.BASE_URL}/materials/${materialClass}/query`,
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

  public createMaterialStandard(
    standard: MaterialStandardV2,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials/${materialClass}/materialStandards`,
      standard
    );
  }

  public createManufacturerSupplier(
    supplier: ManufacturerSupplierV2,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials/${materialClass}/manufacturerSuppliers`,
      supplier
    );
  }

  public createMaterial(
    material: Material | MaterialV2 | MaterialRequest,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials/${materialClass}`,
      material
    );
  }

  public deleteMaterialStandard(
    id: number,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.delete<void>(
      `${this.BASE_URL}/materials/${materialClass}/materialStandards/${id}`
    );
  }

  public deleteManufacturerSupplier(
    id: number,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.delete<void>(
      `${this.BASE_URL}/materials/${materialClass}/manufacturerSuppliers/${id}`
    );
  }

  public deleteMaterial(
    id: number,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.delete<void>(
      `${this.BASE_URL}/materials/${materialClass}/${id}`
    );
  }
}
