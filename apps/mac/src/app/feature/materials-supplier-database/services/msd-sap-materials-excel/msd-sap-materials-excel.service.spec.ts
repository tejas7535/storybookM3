import { TranslocoModule } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MsdSapMaterialsExcelService } from '@mac/msd/services';

import { SAPMaterial } from '../../models';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('MsdSapMaterialsExcelService', () => {
  let spectator: SpectatorService<MsdSapMaterialsExcelService>;
  let service: MsdSapMaterialsExcelService;

  const createService = createServiceFactory({
    service: MsdSapMaterialsExcelService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should build Excel data', () => {
    const rejected = [
      {
        materialNumber: '111122222-1111',
        materialDescription: 'Test-Material-001',
        materialGroup: 'M36042',
        category: 'M413',
        businessPartnerId: '1000001',
        supplierId: 'S000000001',
        plant: '0045',
        supplierCountry: 'DE',
        supplierRegion: 'EU',
        emissionFactorKg: 1.2,
        emissionFactorPc: 1.1,
        dataComment: 'test data',
        recycledMaterialShare: 0,
        secondaryMaterialShare: 4,
        rawMaterialManufacturer: 'test manufacturer',
        incoterms: 'DAP',
        supplierLocation: 'Paris',
        fossilEnergyShare: 30,
        nuclearEnergyShare: 45,
        renewableEnergyShare: 25,
        onlyRenewableElectricity: false,
        validFrom: 1_704_063_600_000,
        validUntil: 1_862_002_800_000,
        primaryDataShare: 77,
        dqrPrimary: 1.1,
        secondaryDataSources: 'secondary1',
        crossSectoralStandardsUsed: 'Std1',
        customerCalculationMethodApplied: true,
        linkToCustomerCalculationMethod: 'https://www.google.de',
        calculationMethodVerifiedBy3rdParty: false,
        linkTo3rdPartyVerificationProof: 'http://www.bing.com',
        serviceInputGrossWeight: 33,
        netWeight: 33,
        weightDataSource: 'Supplier',
        materialUtilizationFactor: 1,
        materialGroupOfRawMaterial: 'M011',
        rawMaterialEmissionFactor: 3.2,
        processSurcharge: 1.1,
        rawMaterial: 'RT1',
        directSupplierEmissions: 0.5,
        indirectSupplierEmissions: 0.5,
        upstreamEmissions: 0.2,
        owner: 'Testermann, Tester TT/ZZ',
        maturity: 10,
        dataDate: 999,
        modifiedBy: 'unknown',
        timestamp: 999,
        historic: false,
        rejected: true,
        uploadId: '486d8b0c-d85d-48cd-b2f1-2cb6d43c58b3',
      },
      {
        materialNumber: '111122222-1112-11',
        materialDescription: 'Test-Material-002',
        materialGroup: 'M36042',
        category: 'M413',
        businessPartnerId: '1000002',
        supplierId: 'S000000002',
        plant: '0046',
        supplierCountry: 'US',
        supplierRegion: 'AM',
        emissionFactorKg: 25.8,
        dataComment: 'test data',
        secondaryMaterialShare: 4,
        rawMaterialManufacturer: 'test manufacturer',
        incoterms: 'FCA',
        supplierLocation: 'Berlin',
        nuclearEnergyShare: 40,
        validFrom: 1_672_441_200_000,
        validUntil: 1_862_089_200_000,
        primaryDataShare: 22,
        dqrPrimary: 3.2,
        secondaryDataSources: 'secondary2',
        crossSectoralStandardsUsed: 'Std2',
        linkToCustomerCalculationMethod: 'http://www.google.de',
        pcfLogistics: 18.1,
        serviceInputGrossWeight: 44.5,
        weightDataSource: 'Drawing',
        materialUtilizationFactor: 0.000_01,
        materialGroupOfRawMaterial: 'M012',
        rawMaterialEmissionFactor: 3.2,
        owner: 'Testermann, Tester TT/ZZ',
        maturity: 10,
        dataDate: 123,
        modifiedBy: 'unknown',
        timestamp: 123,
        historic: false,
        rejected: true,
        uploadId: '486d8b0c-d85d-48cd-b2f1-2cb6d43c58b3',
      },
    ] as unknown as SAPMaterial[];

    const expected = [
      {
        materialNumber: '111122222-1111',
        materialDescription: 'Test-Material-001',
        recycledMaterialShare: 0,
        secondaryMaterialShare: 0.04,
        dataComment: 'test data',
        businessPartnerId: '1000001',
        rawMaterialManufacturer: 'test manufacturer',
        incoterms: 'DAP',
        supplierLocation: 'Paris',
        plant: '0045',
        fossilEnergyShare: 0.3,
        nuclearEnergyShare: 0.45,
        renewableEnergyShare: 0.25,
        onlyRenewableElectricity: 'No',
        validFrom: new Date(rejected[0].validFrom),
        validUntil: new Date(rejected[0].validUntil),
        primaryDataShare: 0.77,
        dqrPrimary: 1.1,
        secondaryDataSources: 'secondary1',
        crossSectoralStandardsUsed: 'Std1',
        customerCalculationMethodApplied: 'Yes',
        linkToCustomerCalculationMethod: 'https://www.google.de',
        calculationMethodVerifiedBy3rdParty: 'No',
        linkTo3rdPartyVerificationProof: 'http://www.bing.com',
        emissionFactorKg: 1.2,
        emissionFactorPc: 1.1,
        serviceInputGrossWeight: 33,
        netWeight: 33,
        weightDataSource: 'Supplier',
        materialUtilizationFactor: 1,
        materialGroupOfRawMaterial: 'M011',
        rawMaterialEmissionFactor: 3.2,
        processSurcharge: 1.1,
        rawMaterial: 'RT1',
        directSupplierEmissions: 0.5,
        indirectSupplierEmissions: 0.5,
        upstreamEmissions: 0.2,
      },
      {
        materialNumber: '111122222-1112-11',
        materialDescription: 'Test-Material-002',
        secondaryMaterialShare: 0.04,
        dataComment: 'test data',
        businessPartnerId: '1000002',
        rawMaterialManufacturer: 'test manufacturer',
        incoterms: 'FCA',
        supplierLocation: 'Berlin',
        plant: '0046',
        nuclearEnergyShare: 0.4,
        validFrom: new Date(rejected[1].validFrom),
        validUntil: new Date(rejected[1].validUntil),
        primaryDataShare: 0.22,
        dqrPrimary: 3.2,
        secondaryDataSources: 'secondary2',
        crossSectoralStandardsUsed: 'Std2',
        linkToCustomerCalculationMethod: 'http://www.google.de',
        emissionFactorKg: 25.8,
        pcfLogistics: 18.1,
        serviceInputGrossWeight: 44.5,
        weightDataSource: 'Drawing',
        materialUtilizationFactor: 0.000_01,
        materialGroupOfRawMaterial: 'M012',
        rawMaterialEmissionFactor: 3.2,
      },
    ];

    expect(service['buildExcelData'](rejected)).toEqual(expected);
  });

  describe('mapBooleanToString', () => {
    test('should return Yes', () => {
      expect(service['mapBooleanToString'](true)).toBe('Yes');
    });

    test('should return No', () => {
      expect(service['mapBooleanToString'](false)).toBe('No');
    });

    test('should return undefined', () => {
      const value: boolean = undefined;
      expect(service['mapBooleanToString'](value)).toBeUndefined();
    });
  });

  describe('mapDateNumberToDate', () => {
    test('should map to date', () => {
      const value = 1_672_441_200_000;
      expect(service['mapDateNumberToDate'](value)).toStrictEqual(
        new Date(value)
      );
    });

    test('should return undefined', () => {
      const value: number = undefined;
      expect(service['mapDateNumberToDate'](value)).toBeUndefined();
    });
  });

  describe('mapPercentToDecimal', () => {
    test('should map to decimal', () => {
      expect(service['mapPercentToDecimal'](25)).toBe(0.25);
    });

    test('should return undefined', () => {
      const value: number = undefined;
      expect(service['mapPercentToDecimal'](value)).toBeUndefined();
    });
  });
});
