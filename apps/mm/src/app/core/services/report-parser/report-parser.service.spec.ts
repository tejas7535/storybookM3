import { CalculationResult } from '@mm/core/store/models/calculation-result-state.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BLOCK, STRING_OUTP_RESULTS } from '../bearinx-result.constant';
import { BearinxOnlineResult } from '../bearinx-result.interface';
import {
  JSON_REPORT_ALL_TYPES_INPUTS_MOCK,
  JSON_REPORT_FULL_RESPONSE_MOCK,
  JSON_REPORT_INCORRECT_INPUT_MOCK,
  JSON_REPORT_LOCKNUT_AND_CHECK_VALUES_MOCK,
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
        expect(result.mountingTools.pumps).toEqual([]);
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
        expect(result.mountingTools.sleveConnectors).toEqual([]);
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
        expect(result.mountingTools.sleveConnectors).toMatchSnapshot();
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
      ).toThrowError(new Error('Unexpected identifier: incorrect identifier'));
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
});
