/* eslint-disable unicorn/no-useless-undefined */
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  ALL_IMPORTANT_END_POSITIONS,
  ALL_IMPORTANT_POSITIONS,
  CLEARANCE_CLASSES_RESULT_WITH_ITEMS,
  EMPTY_END_POSITIONS,
  EMPTY_POSITIONS,
  MIXED_IMPORTANT_END_POSITIONAL_REVERSE_ORDER,
  MIXED_IMPORTANT_POSITIONAL_REVERSE_ORDER,
  NO_IMPORTANT_END_POSITIONS,
  NO_IMPORTANT_POSITIONS,
  RADIAL_CLEARANCE_RESULT_WITH_ITEMS,
  SOME_IMPORTANT_END_POSITIONS,
  SOME_IMPORTANT_POSITIONS,
} from './../../../../testing/mocks/result-positions-priority.mock';
import { ResultPositionsPriorityService } from './result-positions-priority.service';

describe('ResultPositionsPriorityService', () => {
  let spectator: SpectatorService<ResultPositionsPriorityService>;
  let service: ResultPositionsPriorityService;

  const createService = createServiceFactory({
    service: ResultPositionsPriorityService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPrioritizedStartItems', () => {
    it('should return empty array when input is empty', () => {
      const result = service.getPrioritizedStartItems(EMPTY_POSITIONS);
      expect(result).toEqual([]);
    });

    it('should mark no items as important when none match important abbreviations', () => {
      const result = service.getPrioritizedStartItems(NO_IMPORTANT_POSITIONS);
      expect(result.some((item) => item.isImportant)).toBeFalsy();
      expect(result).toMatchSnapshot();
    });

    it('should mark items as important and put them first in result', () => {
      const result = service.getPrioritizedStartItems(SOME_IMPORTANT_POSITIONS);
      // Keep one critical assertion explicit
      expect(result[0].abbreviation).toBe('p_oil_ini');
      expect(result).toMatchSnapshot();
    });

    it('should preserve all items in the result', () => {
      const result = service.getPrioritizedStartItems(SOME_IMPORTANT_POSITIONS);
      expect(result).toHaveLength(SOME_IMPORTANT_POSITIONS.length);
    });

    it('should sort important items according to the predefined order', () => {
      const result = service.getPrioritizedStartItems(ALL_IMPORTANT_POSITIONS);
      expect(result).toMatchSnapshot();
    });

    it('should handle mixed important items and place them in correct order', () => {
      const result = service.getPrioritizedStartItems(
        MIXED_IMPORTANT_POSITIONAL_REVERSE_ORDER
      );
      expect(result).toMatchSnapshot();
    });
  });

  describe('getPrioritizedEndItems', () => {
    it('should return empty array when input is empty', () => {
      const result = service.getPrioritizedEndItems(EMPTY_END_POSITIONS);
      expect(result).toEqual([]);
    });

    it('should mark no items as important when none match important abbreviations', () => {
      const result = service.getPrioritizedEndItems(NO_IMPORTANT_END_POSITIONS);
      expect(result.some((item) => item.isImportant)).toBeFalsy();
      expect(result).toMatchSnapshot();
    });

    it('should mark items as important and put them first in result', () => {
      const result = service.getPrioritizedEndItems(
        SOME_IMPORTANT_END_POSITIONS
      );
      // Check if important items are at the beginning
      expect(result[0].abbreviation).toBe('dx_mnt');
      expect(result).toMatchSnapshot();
    });

    it('should preserve all items in the result', () => {
      const result = service.getPrioritizedEndItems(
        SOME_IMPORTANT_END_POSITIONS
      );
      expect(result).toHaveLength(SOME_IMPORTANT_END_POSITIONS.length);
    });

    it('should sort important items according to the predefined order', () => {
      const result = service.getPrioritizedEndItems(
        ALL_IMPORTANT_END_POSITIONS
      );

      // Verify order: 'dx_mnt' should come before 'Fx_mnt'
      expect(result[0].abbreviation).toBe('dx_mnt');
      expect(result[1].abbreviation).toBe('Fx_mnt');
      expect(result).toMatchSnapshot();
    });

    it('should handle mixed important items and place them in correct order', () => {
      const result = service.getPrioritizedEndItems(
        MIXED_IMPORTANT_END_POSITIONAL_REVERSE_ORDER
      );
      expect(result).toMatchSnapshot();
    });
  });

  describe('getPrioritizedAndFormattedRadialClearance', () => {
    it('should return empty array when input is undefined', () => {
      const result =
        service.getPrioritizedAndFormattedRadialClearance(undefined);
      expect(result).toEqual([]);
    });

    it('should correctly transform radial clearance data', () => {
      const result = service.getPrioritizedAndFormattedRadialClearance(
        RADIAL_CLEARANCE_RESULT_WITH_ITEMS
      );

      expect(result.length).toBe(3);
      expect(result[0].designation).toBe('Clearance 2 ( Item 3 )');
      expect(result.every((item) => item.isImportant)).toBe(true);

      expect(result[0].abbreviation).toBe('c2i1');

      expect(result).toMatchSnapshot();
    });
  });

  describe('getPrioritizedClearanceClasses', () => {
    it('should return empty array when input is undefined', () => {
      const result = service.getPrioritizedClearanceClasses(undefined);
      expect(result).toEqual([]);
    });

    it('should transform data correctly', () => {
      const result = service.getPrioritizedClearanceClasses(
        CLEARANCE_CLASSES_RESULT_WITH_ITEMS
      );
      expect(result).toMatchSnapshot();
    });
  });
});
