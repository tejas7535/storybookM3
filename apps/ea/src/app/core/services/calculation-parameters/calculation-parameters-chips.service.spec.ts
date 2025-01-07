import { CalculationParametersEnergySource } from '@ea/core/store/models';
import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DownstreamOperatingConditions } from '../downstream-calculation.service.interface';
import { CalculationParametersChipsService } from './calculation-parameters-chips.service';
import {
  CalculationChip,
  ElectricityRegionOption,
  FossilOriginOption,
} from './calculation-parameters-form.interface';

describe('CalculationParametersChipsService', () => {
  let spectator: SpectatorService<CalculationParametersChipsService>;

  const createService = createServiceFactory({
    service: CalculationParametersChipsService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn((translateKey) => translateKey),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  describe('getContaminationChip', () => {
    it('should return a CalculationChip with correct values', () => {
      const contaminationOptions = [
        { value: 'LB_HIGH_CLEANLINESS', label: 'High Cleanliness' },
        { value: 'LB_STANDARD_CLEANLINESS', label: 'Standard Cleanliness' },
      ];

      const contamination = 'LB_STANDARD_CLEANLINESS';

      const result: CalculationChip = spectator.service.getContaminationChip(
        contaminationOptions,
        contamination
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('getEnergySourceChip', () => {
    let type: CalculationParametersEnergySource['type'];
    let fossilOrigin:
      | DownstreamOperatingConditions['fossilEmissionFactor']
      | undefined;

    let electricityRegion:
      | DownstreamOperatingConditions['electricEmissionFactor']
      | undefined;

    const fossilOptions: FossilOriginOption[] = [
      { value: 'LB_GASOLINE_E10', label: 'Gasoline E10' },
    ];
    const electricityRegionOptions: ElectricityRegionOption[] = [
      { value: 'LB_AUSTRALIA', label: 'Australia' },
      { value: 'LB_EUROPEAN_UNION', label: 'European Union' },
    ];

    beforeEach(() => {});
    describe('when type is electric', () => {
      beforeEach(() => {
        type = 'electric';
      });
      it('should return a CalculationChip with correct values', () => {
        electricityRegion = 'LB_AUSTRALIA';

        const result: CalculationChip = spectator.service.getEnergySourceChip(
          type,
          fossilOrigin,
          electricityRegion,
          fossilOptions,
          electricityRegionOptions
        );

        expect(result).toMatchSnapshot();
      });

      it('should return correct value for European union', () => {
        electricityRegion = 'LB_EUROPEAN_UNION';

        const result: CalculationChip = spectator.service.getEnergySourceChip(
          type,
          fossilOrigin,
          electricityRegion,
          fossilOptions,
          electricityRegionOptions
        );

        expect(result).toMatchSnapshot();
      });

      it('should return empty for non option value', () => {
        electricityRegion = 'LB_FRANCE';

        const result: CalculationChip = spectator.service.getEnergySourceChip(
          type,
          fossilOrigin,
          electricityRegion,
          fossilOptions,
          electricityRegionOptions
        );

        expect(result).toMatchSnapshot();
      });
    });

    describe('when type is fossil', () => {
      beforeEach(() => {
        type = 'fossil';
      });
      it('should return a CalculationChip with correct values', () => {
        fossilOrigin = 'LB_GASOLINE_E10';

        const result: CalculationChip = spectator.service.getEnergySourceChip(
          type,
          fossilOrigin,
          electricityRegion,
          fossilOptions,
          electricityRegionOptions
        );

        expect(result).toMatchSnapshot();
      });

      it('should return empty value for non option value', () => {
        fossilOrigin = 'LB_CNG';

        const result: CalculationChip = spectator.service.getEnergySourceChip(
          type,
          fossilOrigin,
          electricityRegion,
          fossilOptions,
          electricityRegionOptions
        );

        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('getTimeChip', () => {
    it('should return a CalculationChip with correct values', () => {
      const numberOfHours = 2000;

      const result: CalculationChip =
        spectator.service.getTimeChip(numberOfHours);

      expect(result).toMatchSnapshot();
    });
  });
});
