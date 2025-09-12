import { CalculationResult } from '@mm/core/store/models/calculation-result-state.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BLOCK, STRING_OUTP_RESULTS } from '../bearinx-result.constant';
import { BearinxOnlineResult } from '../bearinx-result.interface';
import {
  JSON_REPORT_ALL_TYPES_INPUTS_MOCK,
  JSON_REPORT_FULL_RESPONSE_MOCK,
  JSON_REPORT_INCORRECT_INPUT_MOCK,
  JSON_REPORT_LOCKNUT_AND_CHECK_VALUES_MOCK,
  JSON_REPORT_THERMAL_BEARING_MOCK,
} from './../../../../testing/mocks/report-parser.mock';
import { ReportParserService } from './report-parser.service';

describe('ReportParserService', () => {
  let spectator: SpectatorService<ReportParserService>;
  let service: ReportParserService;
  let result: CalculationResult;
  const createService = createServiceFactory(ReportParserService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isRecommendedPump', () => {
    let isRecommendedPump: (value: string) => boolean;

    beforeEach(() => {
      isRecommendedPump = (service as any)['isRecommendedPump'].bind(service);
    });

    it('should identify "recommended" as a recommended pump', () => {
      expect(isRecommendedPump('recommended')).toBe(true);
    });

    it('should identify "empfohlen" (German) as a recommended pump', () => {
      expect(isRecommendedPump('empfohlen')).toBe(true);
    });

    it('should identify "se recomienda" (Spanish) as a recommended pump', () => {
      expect(isRecommendedPump('se recomienda')).toBe(true);
    });

    it('should identify "recommandé" (French) as a recommended pump', () => {
      expect(isRecommendedPump('recommandé')).toBe(true);
    });

    it('should identify "рекомендуется" (Russian) as a recommended pump', () => {
      expect(isRecommendedPump('рекомендуется')).toBe(true);
    });

    it('should identify "推荐" (Chinese) as a recommended pump', () => {
      expect(isRecommendedPump('推荐')).toBe(true);
    });

    it('should not identify "alternative" as a recommended pump', () => {
      expect(isRecommendedPump('alternative')).toBe(false);
    });

    it('should not identify empty string as a recommended pump', () => {
      expect(isRecommendedPump('')).toBe(false);
    });

    it('should not identify any other string as a recommended pump', () => {
      expect(isRecommendedPump('some other value')).toBe(false);
    });
  });

  describe('parseResponse', () => {
    describe('when result is defined', () => {
      beforeEach(() => {
        result = service.parseResponse(JSON_REPORT_FULL_RESPONSE_MOCK);
      });

      it('should parse response end positions data', () => {
        expect(result.endPositions).toMatchSnapshot();
      });

      it('should parse mounting recommendations data', () => {
        expect(result.mountingRecommendations).toMatchSnapshot();
      });

      it('should have empty errors', () => {
        expect(result.reportMessages.errors).toMatchSnapshot();
      });

      it('should have warnings', () => {
        expect(result.reportMessages.warnings).toMatchSnapshot();
      });

      it('should have notes', () => {
        expect(result.reportMessages.notes).toMatchSnapshot();
      });

      it('should have inputs', () => {
        expect(result.inputs).toMatchSnapshot();
      });

      it('should have pumps with recommended and alternative boolean flag', () => {
        expect(result.mountingTools.pumps).toMatchSnapshot();
      });

      it('should have nut data', () => {
        expect(result.mountingTools.hydraulicNut).toMatchSnapshot();
      });
    });

    describe('when result is undefined', () => {
      beforeEach(() => {
        result = service.parseResponse({
          subordinates: [
            {
              titleID: STRING_OUTP_RESULTS,
              identifier: BLOCK,
              subordinates: [],
            },
          ],
        } as Partial<BearinxOnlineResult> as BearinxOnlineResult);
      });

      it('should return empty end positions', () => {
        expect(result.endPositions).toEqual([]);
      });

      it('should return empty mounting recommendations', () => {
        expect(result.mountingRecommendations).toEqual([]);
      });

      it('should have empty errors', () => {
        expect(result.reportMessages.errors).toEqual([]);
      });

      it('should have empty warnings', () => {
        expect(result.reportMessages.warnings).toEqual([]);
      });

      it('should have empty notes', () => {
        expect(result.reportMessages.notes).toEqual([]);
      });

      it('should have empty pumps', () => {
        expect(result.mountingTools.pumps).toEqual({ title: '', items: [] });
      });

      it('should have empty nut data', () => {
        expect(result.mountingTools.hydraulicNut).toEqual([]);
      });

      it('should have empty radial clearance data', () => {
        expect(result.radialClearance).toEqual([]);
      });

      it('should have empty clearance classes data', () => {
        expect(result.clearanceClasses).toEqual([]);
      });

      it('should have empty sleeve connectors data', () => {
        expect(result.mountingTools.sleeveConnectors).toEqual([]);
      });

      it('should have empty input data', () => {
        expect(result.inputs).toEqual([]);
      });
    });
  });

  describe('parse Response with checknut and clearances', () => {
    describe('when result is defined', () => {
      beforeEach(() => {
        result = service.parseResponse(
          JSON_REPORT_LOCKNUT_AND_CHECK_VALUES_MOCK
        );
      });

      it('should parse radial clearance data', () => {
        expect(result.radialClearance).toMatchSnapshot();
      });

      it('should parse clearance classes data', () => {
        expect(result.clearanceClasses).toMatchSnapshot();
      });

      it('should parse locknut data', () => {
        expect(result.mountingTools.locknut).toMatchSnapshot();
      });

      it('should parse sleeve connectors data', () => {
        expect(result.mountingTools.sleeveConnectors).toMatchSnapshot();
      });

      it('should have empty notes section', () => {
        expect(result.reportMessages.notes).toMatchSnapshot();
      });
    });
  });

  describe('when parsing incorrect input response', () => {
    it('should throw error', () => {
      expect(() =>
        service.parseResponse(
          JSON_REPORT_INCORRECT_INPUT_MOCK as BearinxOnlineResult
        )
      ).toThrow(new Error('Unexpected identifier: incorrect identifier'));
    });
  });

  describe('when parsing input with all possible identifier types', () => {
    beforeEach(() => {
      result = service.parseResponse(
        JSON_REPORT_ALL_TYPES_INPUTS_MOCK as BearinxOnlineResult
      );
    });

    it('should parse inputs', () => {
      expect(result.inputs).toMatchSnapshot();
    });
  });

  describe('when parsing thermal bearing response', () => {
    beforeEach(() => {
      result = service.parseResponse(JSON_REPORT_THERMAL_BEARING_MOCK);
    });

    it('should extract temperatures from thermal bearing response', () => {
      expect(result.temperatures).toEqual([
        {
          designation: 'Heating temperature',
          abbreviation: 'T',
          value: '58.7',
          unit: '°C',
        },
      ]);
    });

    it('should include temperatures in the result', () => {
      expect(result.temperatures).toBeDefined();
      expect(result.temperatures).toHaveLength(1);
    });
  });
});
