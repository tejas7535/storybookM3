/* eslint-disable max-lines */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

import { environment } from '@mac/environments/environment';
import { MaterialClass } from '@mac/msd/constants';
import {
  ManufacturerSupplierV2,
  Material,
  MaterialRequest,
  MaterialResponse,
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
          // eslint-disable-next-line complexity
          materialResponses.map(
            // eslint-disable-next-line complexity
            (materialResponse: MaterialResponse) =>
              ({
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
                manufacturerSupplierId:
                  materialResponse.manufacturerSupplier.id,
                manufacturerSupplierName:
                  materialResponse.manufacturerSupplier.name,
                manufacturerSupplierPlant:
                  materialResponse.manufacturerSupplier.plant,
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
                        (sapData: { sapSupplierId: string }) =>
                          sapData.sapSupplierId
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
                ssid:
                  'ssid' in materialResponse
                    ? materialResponse.ssid
                    : undefined,
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
                  'blocked' in materialResponse
                    ? materialResponse.blocked
                    : undefined,
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
                rating:
                  'rating' in materialResponse
                    ? materialResponse.rating
                    : undefined,
                ratingRemark:
                  'ratingRemark' in materialResponse
                    ? materialResponse.ratingRemark
                    : undefined,
                ratingChangeComment:
                  'ratingChangeComment' in materialResponse
                    ? materialResponse.ratingChangeComment
                    : undefined,
                lastModified: materialResponse.timestamp,
              } as unknown as T)
          )
        )
      );
  }

  public fetchManufacturerSuppliers(materialClass: MaterialClass) {
    return this.httpClient.get<ManufacturerSupplierV2[]>(
      `${this.BASE_URL}/materials/${materialClass}/manufacturerSuppliers`
    );
  }

  public fetchMaterialStandards(materialClass: MaterialClass) {
    return this.httpClient.get<MaterialStandardV2[]>(
      `${this.BASE_URL}/materials/${materialClass}/materialStandards`
    );
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
}
