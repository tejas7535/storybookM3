/* eslint-disable max-lines */
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { StringOption } from '@schaeffler/inputs';

import { environment } from '@mac/environments/environment';
import {
  MAP_COUNTRY_TO_REGION,
  MaterialClass,
  SupportedMaterialClasses,
} from '@mac/msd/constants';
import {
  ManufacturerSupplier,
  ManufacturerSupplierTableValue,
  Material,
  MaterialRequest,
  MaterialResponse,
  MaterialStandard,
  MaterialStandardTableValue,
  SAPMaterial,
  SAPMaterialHistoryValue,
  SapMaterialsDatabaseUploadStatusResponse,
  SAPMaterialsRequest,
  SAPMaterialsResponse,
  SapMaterialsUpload,
  SapMaterialsUploadResponse,
  SapValueWithText,
} from '@mac/msd/models';

import {
  findProperty,
  mapProperty,
} from '../../main-table/dialogs/material-input-dialog/util/form-helpers';

@Injectable({
  providedIn: 'root',
})
export class MsdDataService {
  private readonly MSD_URL = '/materials-supplier-database/api/';

  private readonly BASE_URL = `${environment.baseUrl}${this.MSD_URL}v3`;
  private readonly BASE_URL_SAP = `${environment.baseUrl}${this.MSD_URL}v1`;

  private readonly SAP_MATERIALS_UPLOAD_ID_LOCAL_STORAGE_KEY =
    'MSD_SAP_MATERIALS_UPLOAD_ID';

  private readonly TOOLTIP_DELAY = 1500;

  constructor(
    private readonly httpClient: HttpClient,
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage
  ) {}

  public getMaterialClasses() {
    return this.httpClient
      .get<string[]>(`${this.BASE_URL}/materials/materialClasses`)
      .pipe(
        map((materialClasses) => materialClasses as MaterialClass[]),
        map((materialClasses) =>
          materialClasses.filter((mc) => SupportedMaterialClasses.includes(mc))
        )
      );
  }

  public getProductCategories(materialClass: MaterialClass) {
    return this.httpClient
      .get<
        string[]
      >(`${this.BASE_URL}/materials/${materialClass}/productCategories`)
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

  public getMaterials<T extends Material = Material>(
    materialClass: string,
    category?: string[]
  ): Observable<Material[]> {
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

  public getHistoryForMaterial<T extends Material = Material>(
    materialClass: string,
    id: number
  ): Observable<Material[]> {
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

  public fetchManufacturerSuppliers(materialClass: MaterialClass) {
    return this.httpClient.get<ManufacturerSupplier[]>(
      `${this.BASE_URL}/materials/${materialClass}/manufacturerSuppliers`
    );
  }

  public getHistoryForManufacturerSupplier(
    materialClass: MaterialClass,
    id: number
  ) {
    return this.httpClient.get<ManufacturerSupplier[]>(
      `${this.BASE_URL}/materials/${materialClass}/history/manufacturerSuppliers/${id}`,
      {
        params: { current: true },
      }
    );
  }

  public mapSuppliersToTableView(
    suppliers: ManufacturerSupplier[]
  ): ManufacturerSupplierTableValue[] {
    return suppliers.map((supplier) => this.mapSuppliers(supplier));
  }

  public fetchMaterialStandards(materialClass: MaterialClass) {
    return this.httpClient.get<MaterialStandard[]>(
      `${this.BASE_URL}/materials/${materialClass}/materialStandards`
    );
  }

  public getHistoryForMaterialStandard(
    materialClass: MaterialClass,
    id: number
  ) {
    return this.httpClient.get<MaterialStandard[]>(
      `${this.BASE_URL}/materials/${materialClass}/history/materialStandards/${id}`,
      {
        params: { current: true },
      }
    );
  }

  public mapStandardsToTableView(
    standards: MaterialStandard[]
  ): MaterialStandardTableValue[] {
    return standards.map((std) => this.mapStandards(std));
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
      .get<
        string[]
      >(`${this.BASE_URL}/materials/${materialClass}/productionProcesses`)
      .pipe(
        map((processes) =>
          processes.map((process) => {
            const title = translate(
              `materialsSupplierDatabase.productionProcessValues.${materialClass}.${process}`
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
      .get<string[]>(`${this.BASE_URL}/materials/co2Classifications`)
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

  public fetchReferenceDocuments(materialClass: MaterialClass) {
    const body = {
      select: ['referenceDoc'],
      distinct: true,
    };

    return this.httpClient.post<string[][]>(
      `${this.BASE_URL}/materials/${materialClass}/query`,
      body
    );
  }

  public getConditions(materialClass: MaterialClass) {
    return this.httpClient
      .get<string[]>(`${this.BASE_URL}/materials/${materialClass}/conditions`)
      .pipe(
        map((conditions) =>
          conditions.map((condition) => {
            const title = translate(
              `materialsSupplierDatabase.condition.${materialClass}.${condition}`
            );

            return {
              id: condition,
              tooltipDelay: this.TOOLTIP_DELAY,
              tooltip: title,
              title,
            } as StringOption;
          })
        )
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
    steelMakingProcess?: string,
    productCategory?: string
  ) {
    const where: { col: string; op: string; values: number[] | string[] }[] = [
      { col: 'manufacturerSupplier.id', op: 'IN', values: [supplierId] },
    ];
    if (steelMakingProcess) {
      where.push({
        col: 'steelMakingProcess',
        op: 'IN',
        values: [steelMakingProcess],
      });
    }
    if (productCategory) {
      where.push({
        col: 'productCategory',
        op: 'IN',
        values: [productCategory],
      });
    }
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
      .post<
        [number, number, number, number, string][]
      >(`${this.BASE_URL}/materials/${materialClass}/query`, body)
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
    standard: MaterialStandard,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials/${materialClass}/materialStandards`,
      standard
    );
  }

  public createManufacturerSupplier(
    supplier: ManufacturerSupplier,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials/${materialClass}/manufacturerSuppliers`,
      supplier
    );
  }

  public createMaterial(
    material: Material | MaterialRequest,
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.post<{ id: number }>(
      `${this.BASE_URL}/materials/${materialClass}`,
      material
    );
  }

  public bulkEditMaterial(
    materials: MaterialRequest[],
    materialClass: MaterialClass = MaterialClass.STEEL
  ) {
    return this.httpClient.post(
      `${this.BASE_URL}/materials/${materialClass}/bulk`,
      materials
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

  public fetchSAPMaterials(request: SAPMaterialsRequest) {
    return this.httpClient.post<SAPMaterialsResponse>(
      `${this.BASE_URL_SAP}/emissionfactor/query`,
      request
    );
  }

  public getHistoryForSAPMaterial(
    materialNumber: string,
    supplierId: string,
    plant: string
  ): Observable<SAPMaterialHistoryValue[]> {
    return this.httpClient
      .get<
        SAPMaterial[]
      >(`${this.BASE_URL_SAP}/emissionfactor/history/${materialNumber}/${supplierId}/${plant}`)
      .pipe(
        map((sapMaterials: SAPMaterial[]) =>
          sapMaterials.map((material: SAPMaterial) =>
            this.mapSapMaterial(material)
          )
        )
      );
  }

  public uploadSapMaterials(
    upload: SapMaterialsUpload
  ): Observable<HttpEvent<SapMaterialsUploadResponse>> {
    const formData = new FormData();
    formData.append('owner', upload.owner);
    formData.append('date', upload.date.format('YYYY-MM-DD'));
    formData.append('maturity', upload.maturity.toString());
    formData.append('file', upload.file);

    return this.httpClient.post<SapMaterialsUploadResponse>(
      `${this.BASE_URL_SAP}/emissionfactor/upload/file`,
      formData,
      { reportProgress: true, observe: 'events' }
    );
  }

  public getSapMaterialsDatabaseUploadStatus(
    uploadId: string
  ): Observable<SapMaterialsDatabaseUploadStatusResponse> {
    return this.httpClient.get<SapMaterialsDatabaseUploadStatusResponse>(
      `${this.BASE_URL_SAP}/emissionfactor/upload/status/${uploadId}`
    );
  }

  public getRejectedSapMaterials(uploadId: string): Observable<SAPMaterial[]> {
    return this.httpClient.get<SAPMaterial[]>(
      `${this.BASE_URL_SAP}/emissionfactor/upload/rejected/${uploadId}`
    );
  }

  public deleteRejectedSapMaterials(uploadId: string): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.BASE_URL_SAP}/emissionfactor/upload/rejected/${uploadId}`
    );
  }

  public getDistinctSapValues(column: string): Observable<string[]> {
    return this.httpClient
      .get<{
        values: string[];
      }>(`${this.BASE_URL_SAP}/emissionfactor/distinct/${column}`, {})
      .pipe(map((v) => v.values));
  }

  public getDistinctSapValuesWithText(
    column: string,
    textColumn: string
  ): Observable<SapValueWithText[]> {
    return this.httpClient
      .get<{
        values: SapValueWithText[];
      }>(`${this.BASE_URL_SAP}/emissionfactor/distinct/${column}`, {
        params: { textColumn },
      })
      .pipe(map((v) => v.values));
  }

  /**
   * Store the given upload ID to local storage.
   *
   * @param uploadId ID of the SAP materials upload process
   */
  public storeSapMaterialsUploadId(uploadId: string): void {
    this.localStorage.setItem(
      this.SAP_MATERIALS_UPLOAD_ID_LOCAL_STORAGE_KEY,
      uploadId
    );
  }

  /**
   * Remove the stored upload ID from local storage.
   */
  public removeSapMaterialsUploadId(): void {
    this.localStorage.removeItem(
      this.SAP_MATERIALS_UPLOAD_ID_LOCAL_STORAGE_KEY
    );
  }

  /**
   * Get ID of the currently running SAP materials upload process from local storage.
   *
   * @returns the upload ID or null
   */
  public getSapMaterialsUploadId(): string {
    return this.localStorage.getItem(
      this.SAP_MATERIALS_UPLOAD_ID_LOCAL_STORAGE_KEY
    );
  }

  private fromJson(json: string[]): string[] {
    return json?.length > 0 ? json : undefined;
  }

  // eslint-disable-next-line complexity
  private mapMaterials<T extends Material = Material>(
    materialResponse: MaterialResponse
  ): T {
    return {
      id: materialResponse.id,
      materialStandardId: materialResponse.materialStandard.id,
      materialStandardMaterialName:
        materialResponse.materialStandard.materialName,
      materialNumbers: findProperty(
        materialResponse.materialStandard,
        'materialNumber'
      ),
      materialStandardStandardDocument:
        materialResponse.materialStandard.standardDocument,
      materialStandardWiamId: findProperty(
        materialResponse.materialStandard,
        'wiamId'
      ),
      materialStandardStoffId: findProperty(
        materialResponse.materialStandard,
        'stoffId'
      ),

      manufacturerSupplierId: materialResponse.manufacturerSupplier.id,
      manufacturerSupplierName: materialResponse.manufacturerSupplier.name,
      manufacturerSupplierPlant: materialResponse.manufacturerSupplier.plant,
      manufacturerSupplierCountry:
        materialResponse.manufacturerSupplier.country,
      manufacturerSupplierRegion: MAP_COUNTRY_TO_REGION(
        materialResponse.manufacturerSupplier.country
      ),
      manufacturerSupplierSapSupplierIds: findProperty<string[]>(
        materialResponse.manufacturerSupplier,
        'sapSupplierIds'
      ),
      manufacturerSupplierBusinessPartnerIds: findProperty<number[]>(
        materialResponse.manufacturerSupplier,
        'businessPartnerIds'
      ),
      materialClass: materialResponse.materialClass as MaterialClass,
      selfCertified: findProperty(materialResponse, 'selfCertified'),
      manufacturer: findProperty(
        materialResponse.manufacturerSupplier,
        'manufacturer'
      ),
      productCategory: materialResponse.productCategory,
      productCategoryText: materialResponse.productCategory
        ? translate(
            `materialsSupplierDatabase.productCategoryValues.${materialResponse.productCategory}`
          )
        : undefined,
      generalDescription: findProperty(materialResponse, 'generalDescription'),
      referenceDoc: this.fromJson(
        findProperty(materialResponse, 'referenceDoc')
      ),
      co2Scope1: materialResponse.co2Scope1,
      co2Scope2: materialResponse.co2Scope2,
      co2Scope3: materialResponse.co2Scope3,
      co2PerTon: materialResponse.co2PerTon,
      co2Classification: materialResponse.co2Classification,
      releaseDateYear: findProperty(materialResponse, 'releaseDateYear'),
      releaseDateMonth: findProperty(materialResponse, 'releaseDateMonth'),
      releaseRestrictions: materialResponse.releaseRestrictions,
      blocked: findProperty(materialResponse, 'blocked'),
      castingMode: findProperty(materialResponse, 'castingMode'),
      castingDiameter: findProperty(materialResponse, 'castingDiameter'),
      minDimension: findProperty(materialResponse, 'minDimension'),
      maxDimension: findProperty(materialResponse, 'maxDimension'),
      steelMakingProcess: findProperty(materialResponse, 'steelMakingProcess'),
      productionProcess: findProperty(materialResponse, 'productionProcess'),
      productionProcessText: mapProperty<string>(
        materialResponse,
        'productionProcess',
        (val) =>
          translate(
            `materialsSupplierDatabase.productionProcessValues.${materialResponse.materialClass}.${val}`
          )
      ),
      minRecyclingRate: findProperty(materialResponse, 'minRecyclingRate'),
      maxRecyclingRate: findProperty(materialResponse, 'maxRecyclingRate'),
      rating: findProperty(materialResponse, 'rating'),
      ratingRemark: findProperty(materialResponse, 'ratingRemark'),
      ratingChangeComment: findProperty(
        materialResponse,
        'ratingChangeComment'
      ),
      condition: findProperty(materialResponse, 'condition'),
      conditionText: mapProperty<string>(materialResponse, 'condition', (val) =>
        translate(
          `materialsSupplierDatabase.condition.${materialResponse.materialClass}.${val}`
        )
      ),
      co2Type: findProperty(materialResponse, 'co2Type'),
      materialSapId: findProperty(materialResponse, 'materialSapId'),

      lastModified: materialResponse.timestamp,
      modifiedBy: materialResponse.modifiedBy,
    } as Material as T;
  }

  private mapSuppliers(
    manufacturerSupplier: ManufacturerSupplier
  ): ManufacturerSupplierTableValue {
    return {
      id: manufacturerSupplier.id,
      manufacturerSupplierName: manufacturerSupplier.name,
      manufacturerSupplierPlant: manufacturerSupplier.plant,
      manufacturerSupplierCountry: manufacturerSupplier.country,
      manufacturerSupplierRegion: MAP_COUNTRY_TO_REGION(
        manufacturerSupplier.country
      ),
      manufacturer: findProperty(manufacturerSupplier, 'manufacturer'),
      manufacturerSupplierSapSupplierIds: findProperty<string[]>(
        manufacturerSupplier,
        'sapSupplierIds'
      ),
      manufacturerSupplierBusinessPartnerIds: findProperty<number[]>(
        manufacturerSupplier,
        'businessPartnerIds'
      ),
      lastModified: manufacturerSupplier.timestamp,
      modifiedBy: manufacturerSupplier.modifiedBy,
    } as ManufacturerSupplierTableValue;
  }

  private mapStandards(std: MaterialStandard): MaterialStandardTableValue {
    return {
      id: std.id,
      materialStandardMaterialName: std.materialName,
      materialStandardStandardDocument: std.standardDocument,
      materialStandardWiamId: findProperty(std, 'wiamId'),
      materialStandardStoffId: findProperty(std, 'stoffId'),
      materialNumbers: findProperty(std, 'materialNumber'),
      lastModified: std.timestamp,
      modifiedBy: std.modifiedBy,
    } as MaterialStandardTableValue;
  }

  private mapSapMaterial(sapMaterial: SAPMaterial): SAPMaterialHistoryValue {
    return {
      materialNumber: sapMaterial.materialNumber,
      materialDescription: sapMaterial.materialDescription,
      materialGroup: sapMaterial.materialGroup,
      category: sapMaterial.category,
      businessPartnerId: sapMaterial.businessPartnerId,
      supplierId: sapMaterial.supplierId,
      plant: sapMaterial.plant,
      supplierCountry: sapMaterial.supplierCountry,
      supplierRegion: sapMaterial.supplierRegion,
      emissionFactorKg: sapMaterial.emissionFactorKg,
      emissionFactorPc: sapMaterial.emissionFactorPc,
      dataDate: this.mapDateNumberToString(sapMaterial.dataDate),
      dataComment: sapMaterial.dataComment,
      recycledMaterialShare: sapMaterial.recycledMaterialShare,
      secondaryMaterialShare: sapMaterial.secondaryMaterialShare,
      rawMaterialManufacturer: sapMaterial.rawMaterialManufacturer,
      incoterms: sapMaterial.incoterms,
      supplierLocation: sapMaterial.supplierLocation,
      fossilEnergyShare: sapMaterial.fossilEnergyShare,
      nuclearEnergyShare: sapMaterial.nuclearEnergyShare,
      renewableEnergyShare: sapMaterial.renewableEnergyShare,
      onlyRenewableElectricity: this.mapBooleanToString(
        sapMaterial.onlyRenewableElectricity
      ),
      validFrom: this.mapDateNumberToString(sapMaterial.validFrom),
      validUntil: this.mapDateNumberToString(sapMaterial.validUntil),
      primaryDataShare: sapMaterial.primaryDataShare,
      dqrPrimary: sapMaterial.dqrPrimary,
      dqrSecondary: sapMaterial.dqrSecondary,
      secondaryDataSources: sapMaterial.secondaryDataSources,
      crossSectoralStandardsUsed: sapMaterial.crossSectoralStandardsUsed,
      customerCalculationMethodApplied: this.mapBooleanToString(
        sapMaterial.customerCalculationMethodApplied
      ),
      linkToCustomerCalculationMethod:
        sapMaterial.linkToCustomerCalculationMethod,
      calculationMethodVerifiedBy3rdParty: this.mapBooleanToString(
        sapMaterial.calculationMethodVerifiedBy3rdParty
      ),
      linkTo3rdPartyVerificationProof:
        sapMaterial.linkTo3rdPartyVerificationProof,
      pcfVerifiedBy3rdParty: this.mapBooleanToString(
        sapMaterial.pcfVerifiedBy3rdParty
      ),
      pcfLogistics: sapMaterial.pcfLogistics,
      serviceInputGrossWeight: sapMaterial.serviceInputGrossWeight,
      netWeight: sapMaterial.netWeight,
      weightDataSource: sapMaterial.weightDataSource,
      materialUtilizationFactor: sapMaterial.materialUtilizationFactor,
      materialGroupOfRawMaterial: sapMaterial.materialGroupOfRawMaterial,
      rawMaterialEmissionFactor: sapMaterial.rawMaterialEmissionFactor,
      processSurcharge: sapMaterial.processSurcharge,
      rawMaterial: sapMaterial.rawMaterial,
      directSupplierEmissions: sapMaterial.directSupplierEmissions,
      indirectSupplierEmissions: sapMaterial.indirectSupplierEmissions,
      upstreamEmissions: sapMaterial.upstreamEmissions,
      stoffId: sapMaterial.stoffId,
      owner: sapMaterial.owner,
      maturity: sapMaterial.maturity,
      modifiedBy: sapMaterial.modifiedBy,
      lastModified: sapMaterial.timestamp,
    };
  }

  private mapBooleanToString(value: boolean): string {
    if (value !== undefined) {
      return value
        ? translate('materialsSupplierDatabase.mainTable.yes')
        : translate('materialsSupplierDatabase.mainTable.no');
    }

    return undefined;
  }

  private mapDateNumberToString(date: number): string {
    if (date) {
      return new Date(date).toLocaleDateString('en-GB');
    }

    return undefined;
  }
}
