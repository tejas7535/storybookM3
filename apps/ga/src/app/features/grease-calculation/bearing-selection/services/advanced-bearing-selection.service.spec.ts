import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RangeFilter } from '@ga/shared/components/range-filter';
import { ADVANCED_BEARING_SELECTION_FILTERS_MOCK } from '@ga/testing/mocks';

import { AdvancedBearingSelectionService } from './advanced-bearing-selection.service';

describe('AdvancedBearingSelectionService', () => {
  let service: AdvancedBearingSelectionService;
  let spectator: SpectatorService<AdvancedBearingSelectionService>;

  const mockRangeFilterBoreDiameter: RangeFilter = {
    label: 'shared.label.defaultSet',
    max: 9999,
    maxSelected: 456,
    min: 0,
    minSelected: 123,
    name: 'bearing.label.boreDiameter',
    unit: 'shared.unit.millimeterShort',
  };

  const mockRangeFilterOutsideDiameter: RangeFilter = {
    ...mockRangeFilterBoreDiameter,
    name: 'bearing.label.outsideDiameter',
    minSelected: 789,
    maxSelected: 1011,
  };

  const mockRangeFilterWidth: RangeFilter = {
    ...mockRangeFilterBoreDiameter,
    name: 'bearing.label.width',
    minSelected: 1213,
    maxSelected: 1415,
  };

  const createService = createServiceFactory({
    service: AdvancedBearingSelectionService,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should provide setting options', () => {
    expect(service.bearingTypes).toBeDefined();
    expect(service.dimensionMinValue).toBeDefined();
    expect(service.dimensionMaxValue).toBeDefined();
    expect(service.getBoreDiameterRangeFilter).toBeDefined();
    expect(service.getOutsideDiameterRangeFilter).toBeDefined();
    expect(service.getWidthRangeFilter).toBeDefined();
  });

  describe('getBoreDiameterRangeFilter', () => {
    it('should return a valid range filter object', () => {
      const resultWithoutMock = service.getBoreDiameterRangeFilter();
      const resultWithMock = service.getBoreDiameterRangeFilter(
        ADVANCED_BEARING_SELECTION_FILTERS_MOCK
      );

      expect(resultWithoutMock).toEqual({
        ...mockRangeFilterBoreDiameter,
        maxSelected: undefined,
        minSelected: undefined,
      });
      expect(resultWithMock).toEqual(mockRangeFilterBoreDiameter);
    });
  });

  describe('getOutsideDiameterRangeFilter', () => {
    it('should return a valid range filter object', () => {
      const resultWithoutMock = service.getOutsideDiameterRangeFilter();
      const resultWithMock = service.getOutsideDiameterRangeFilter(
        ADVANCED_BEARING_SELECTION_FILTERS_MOCK
      );

      expect(resultWithoutMock).toEqual({
        ...mockRangeFilterOutsideDiameter,
        maxSelected: undefined,
        minSelected: undefined,
      });
      expect(resultWithMock).toEqual(mockRangeFilterOutsideDiameter);
    });
  });

  describe('getWidthRangeFilter', () => {
    it('should return a valid range filter object', () => {
      const resultWithoutMock = service.getWidthRangeFilter();
      const resultWithMock = service.getWidthRangeFilter(
        ADVANCED_BEARING_SELECTION_FILTERS_MOCK
      );

      expect(resultWithoutMock).toEqual({
        ...mockRangeFilterWidth,
        maxSelected: undefined,
        minSelected: undefined,
      });
      expect(resultWithMock).toEqual(mockRangeFilterWidth);
    });
  });
});
