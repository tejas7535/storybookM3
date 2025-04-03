/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { MockService } from 'ng-mocks';

import { AlertRule } from '../../../../../feature/alert-rules/model';
import { Region } from '../../../../../feature/global-selection/model';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { OptionsLoadingResult } from '../../../../../shared/services/selectable-options.service';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { parseSelectableValueIfPossible } from './../../../../../feature/alert-rules/alert-rule-value-parser';
import { ThresholdsRequiredForAlertType } from './alert-rule-edit-single-modal/alert-rule-options-config';
import {
  checkAlertRuleData,
  getSpecialParseFunctions,
  keyFieldCheckAlertRule,
  mandatoryFieldCheckAlertRule,
  thresholdRequirementCheckAlertRule,
} from './alert-rule-logic-helper';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key) => key),
}));

/* eslint-disable complexity */
function getTestRule(testRule?: Partial<AlertRule>): AlertRule {
  return {
    id: 'test',
    salesArea: testRule?.salesArea ?? null,
    salesOrg: testRule?.salesOrg ?? null,
    type: testRule?.type ?? null,
    customerNumber: testRule?.customerNumber ?? null,
    customerName: testRule?.customerName ?? null,
    materialNumber: testRule?.materialNumber ?? null,
    materialDescription: testRule?.materialDescription ?? null,
    materialClassification: testRule?.materialClassification ?? null,
    sectorManagement: testRule?.sectorManagement ?? null,
    productionLine: testRule?.productionLine ?? null,
    productLine: testRule?.productLine ?? null,
    demandPlannerId: testRule?.demandPlannerId ?? null,
    demandPlanner: testRule?.demandPlanner ?? null,
    gkamNumber: testRule?.gkamNumber ?? null,
    gkamName: testRule?.gkamName ?? null,
    startDate: testRule?.startDate ?? null,
    execDay: testRule?.execDay ?? null,
    execInterval: testRule?.execInterval ?? null,
    endDate: testRule?.endDate ?? null,
    deactivated: testRule?.deactivated ?? null,
    activeCount: testRule?.activeCount ?? null,
    inactiveCount: testRule?.inactiveCount ?? null,
    completedCount: testRule?.completedCount ?? null,
    alertComment: testRule?.alertComment ?? null,
    region: testRule?.region ?? null,
    generation: testRule?.generation ?? null,
    usernameCreated: testRule?.usernameCreated ?? null,
    usernameLastChanged: testRule?.usernameLastChanged ?? null,
    threshold1: testRule?.threshold1 ?? null,
    threshold1Description: testRule?.threshold1Description ?? null,
    threshold1Type: testRule?.threshold1Type ?? null,
    threshold2: testRule?.threshold2 ?? null,
    threshold2Description: testRule?.threshold2Description ?? null,
    threshold2Type: testRule?.threshold2Type ?? null,
    threshold3: testRule?.threshold3 ?? null,
    threshold3Description: testRule?.threshold3Description ?? null,
    threshold3Type: testRule?.threshold3Type ?? null,
    currency: testRule?.currency ?? null,
  };
}

describe('AlertRuleLogicHelper', () => {
  describe('checkAlertRuleData', () => {
    it('does not give errors back for a correct alert rule', () => {
      const testRule: AlertRule = getTestRule({
        salesArea: 'DACH',
        type: 'CHKDMP',
        materialNumber: '073659703-0000-10',
        customerNumber: '0000064900',
        region: Region.Europe,
        execInterval: 'M1',
        execDay: 'M01',
        startDate: new Date(),
        endDate: new Date(),
      });

      const errors = checkAlertRuleData(testRule, testRule, []);

      expect(errors.length).toBe(0);
    });

    it('does not give errors back for a correct all required fields but with missing other fields', () => {
      const testRule: AlertRule = {
        salesArea: 'DACH',
        type: 'CHKDMP',
        materialNumber: '073659703-0000-10',
        customerNumber: '0000064900',
        region: Region.Europe,
        execInterval: 'M1',
        execDay: 'M01',
        startDate: new Date(),
        endDate: new Date(),
      } as any;

      const errors = checkAlertRuleData(testRule, testRule, []);

      expect(errors.length).toBe(0);
    });

    it('does not give errors back for a correct alert rule with thresholds', async () => {
      const testRule: AlertRule = getTestRule({
        salesArea: 'DACH',
        type: 'CHKDMP',
        materialNumber: '073659703-0000-10',
        customerNumber: '0000064900',
        region: Region.Europe,
        execInterval: 'M1',
        execDay: 'M01',
        startDate: new Date(),
        endDate: new Date(),
        threshold1: '10%',
        threshold2: '20',
        threshold3: '2',
      });

      const thresholdRequirement: ThresholdsRequiredForAlertType = {
        alertType: 'CHKDMP',
        threshold1: true,
        threshold2: true,
        threshold3: true,
      };

      const errors = checkAlertRuleData(testRule, testRule, [
        thresholdRequirement,
      ]);

      expect(errors.length).toBe(0);
    });

    it('gives errors for missing required fields', () => {
      const testRule: AlertRule = getTestRule({
        salesArea: 'DACH',
        type: 'CHKDMP',
        execDay: 'M01',
        startDate: new Date(),
        endDate: new Date(),
      });
      const errors = checkAlertRuleData(testRule, testRule, []);

      expect(errors.length).toBe(4);
      expect(errors[0].specificField).toBe('region');
      expect(errors[0].errorMessage).toContain('missing');
      expect(errors[1].specificField).toBe('customerNumber');
      expect(errors[1].errorMessage).toContain('missing');
      expect(errors[2].specificField).toBe('materialNumber');
      expect(errors[2].errorMessage).toContain('missing');
      expect(errors[3].specificField).toBe('execInterval');
      expect(errors[3].errorMessage).toContain('missing');
    });

    it('give errors back for missing thresholds', async () => {
      const testRule: AlertRule = getTestRule({
        salesArea: 'DACH',
        type: 'CHKDMP',
        materialNumber: '073659703-0000-10',
        customerNumber: '0000064900',
        region: Region.Europe,
        execInterval: 'M1',
        execDay: 'M01',
        startDate: new Date(),
        endDate: new Date(),
        threshold1: '10%',
      });

      const thresholdRequirement: ThresholdsRequiredForAlertType = {
        alertType: 'CHKDMP',
        threshold1: true,
        threshold2: true,
        threshold3: true,
      };

      const errors = checkAlertRuleData(testRule, testRule, [
        thresholdRequirement,
      ]);

      expect(errors.length).toBe(2);
      expect(errors[0].specificField).toBe('threshold2');
      expect(errors[0].errorMessage).toContain('missing');
      expect(errors[1].specificField).toBe('threshold3');
      expect(errors[1].errorMessage).toContain('missing');
    });

    it('gives errors back for interval and day not matching', () => {
      const testRule: AlertRule = getTestRule({
        salesArea: 'DACH',
        type: 'CHKDMP',
        materialNumber: '073659703-0000-10',
        customerNumber: '0000064900',
        region: Region.Europe,
        execInterval: 'D1',
        execDay: 'M01',
        startDate: new Date(),
        endDate: new Date(),
      });

      const errors = checkAlertRuleData(testRule, testRule, []);

      expect(errors.length).toBe(1);
      expect(errors[0].errorMessage).toContain('execDay_not_valid');
    });
  });

  describe('parseSelectableValueIfPossible', () => {
    const options: SelectableValue[] = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
    ];

    it('should return the id if value matches an option id', () => {
      const parser = parseSelectableValueIfPossible(options);
      const result = parser('1');
      expect(result).toBe('1');
    });

    it('should return the id if value matches an option text', () => {
      const parser = parseSelectableValueIfPossible(options);
      const result = parser('Option 2');
      expect(result).toBe('2');
    });

    it('should return value if it does not match any option id or text', () => {
      const parser = parseSelectableValueIfPossible(options);
      const result = parser('Non-existent');
      expect(result).toBe('Non-existent');
    });

    it('should return value if value is an empty string', () => {
      const parser = parseSelectableValueIfPossible(options);
      const result = parser('');
      expect(result).toBe('');
    });
  });

  describe('keyFieldCheckAlertRule', () => {
    it('should return an error if all key fields are empty', () => {
      const testRule: AlertRule = getTestRule({
        salesArea: null,
        salesOrg: null,
        customerNumber: null,
        sectorManagement: null,
        demandPlannerId: null,
        gkamNumber: null,
      });

      const errors = keyFieldCheckAlertRule(testRule);

      expect(errors.length).toBe(1);
      expect(errors[0].errorMessage).toContain(
        'generic.validation.at_least_one_of'
      );
    });

    it('should not return an error if at least one key field is filled', () => {
      const testRule: AlertRule = getTestRule({
        salesArea: 'DACH',
        salesOrg: null,
        customerNumber: null,
        sectorManagement: null,
        demandPlannerId: null,
        gkamNumber: null,
      });

      const errors = keyFieldCheckAlertRule(testRule);

      expect(errors.length).toBe(0);
    });
  });

  describe('thresholdRequirementCheckAlertRule', () => {
    it('should return an error if a required threshold is missing', () => {
      const testRule: AlertRule = getTestRule({
        threshold1: '10%',
        threshold2: null,
        threshold3: null,
      });

      const thresholdRequirement: ThresholdsRequiredForAlertType = {
        alertType: 'CHKDMP',
        threshold1: true,
        threshold2: true,
        threshold3: true,
      };

      const error = thresholdRequirementCheckAlertRule(
        'threshold2',
        testRule,
        thresholdRequirement
      );

      expect(error).toBeDefined();
      expect(error.specificField).toBe('threshold2');
      expect(error.errorMessage).toContain('generic.validation.missing_fields');
    });

    it('should return undefined if a wrong threshold was passed', () => {
      const testRule: AlertRule = getTestRule({
        threshold1: '10%',
        threshold2: null,
        threshold3: null,
      });

      const thresholdRequirement: ThresholdsRequiredForAlertType = {
        alertType: 'CHKDMP',
        threshold1: true,
        threshold2: true,
        threshold3: true,
      };

      const error = thresholdRequirementCheckAlertRule(
        '99threshold99' as any,
        testRule,
        thresholdRequirement
      );

      expect(error).toBeUndefined();
    });

    it('should not return an error if all required thresholds are filled', () => {
      const testRule: AlertRule = getTestRule({
        threshold1: '10%',
        threshold2: '20',
        threshold3: '2',
      });

      const thresholdRequirement: ThresholdsRequiredForAlertType = {
        alertType: 'CHKDMP',
        threshold1: true,
        threshold2: true,
        threshold3: true,
      };

      const error = thresholdRequirementCheckAlertRule(
        'threshold2',
        testRule,
        thresholdRequirement
      );

      expect(error).toBeUndefined();
    });
  });

  describe('mandatoryFieldCheckAlertRule', () => {
    it('should return an error if a mandatory field is missing', () => {
      const testRule: AlertRule = getTestRule({
        type: null,
        region: null,
        customerNumber: '', // Check also empty string instead of null
        materialNumber: null,
        execInterval: null,
        execDay: null,
        startDate: null,
        endDate: null,
      });

      const errors = mandatoryFieldCheckAlertRule(testRule);

      expect(errors.length).toBe(8);
      expect(errors[0].specificField).toBe('type');
      expect(errors[0].errorMessage).toContain(
        'generic.validation.missing_fields'
      );
    });

    it('should not return an error if all mandatory fields are filled', () => {
      const testRule: AlertRule = getTestRule({
        type: 'CHKDMP',
        region: Region.Europe,
        customerNumber: '0000064900',
        materialNumber: '073659703-0000-10',
        execInterval: 'M1',
        execDay: 'M01',
        startDate: new Date(),
        endDate: new Date(),
      });

      const errors = mandatoryFieldCheckAlertRule(testRule);

      expect(errors.length).toBe(0);
    });
  });

  describe('getSpecialParseFunctions', () => {
    const mockOptions: OptionsLoadingResult = {
      options: [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ],
    };

    it('should return a map with correct parse functions', () => {
      const result = getSpecialParseFunctions({
        alertTypes: mockOptions,
        regionOptions: mockOptions,
        salesAreaOptions: mockOptions,
        salesOrgOptions: mockOptions,
        sectorManagementOptions: mockOptions,
        demandPlannerOptions: mockOptions,
        gkamOptions: mockOptions,
        productLineOptions: mockOptions,
        intervalOpts: mockOptions,
        whenOpts: mockOptions,
        materialClassification: mockOptions,
      });

      expect(result.size).toBe(13);
      expect(result.get('type')).toBeDefined();
      expect(result.get('region')).toBeDefined();
      expect(result.get('salesArea')).toBeDefined();
      expect(result.get('salesOrg')).toBeDefined();
      expect(result.get('sectorManagement')).toBeDefined();
      expect(result.get('demandPlannerId')).toBeDefined();
      expect(result.get('gkamNumber')).toBeDefined();
      expect(result.get('productLine')).toBeDefined();
      expect(result.get('execInterval')).toBeDefined();
      expect(result.get('execDay')).toBeDefined();
      expect(result.get('startDate')).toBeDefined();
      expect(result.get('endDate')).toBeDefined();
      expect(result.get('materialClassification')).toBeDefined();
    });

    it('should parse selectable values correctly', () => {
      const result = getSpecialParseFunctions({
        alertTypes: mockOptions,
        regionOptions: mockOptions,
        salesAreaOptions: mockOptions,
        salesOrgOptions: mockOptions,
        sectorManagementOptions: mockOptions,
        demandPlannerOptions: mockOptions,
        gkamOptions: mockOptions,
        productLineOptions: mockOptions,
        intervalOpts: mockOptions,
        whenOpts: mockOptions,
        materialClassification: mockOptions,
      });

      const parseFunction = result.get('type');
      expect(parseFunction).toBeDefined();
      expect(parseFunction('Option 1')).toBe('1');
      expect(parseFunction('Non-existent')).toBe('Non-existent');
    });

    it('should parse dates correctly', () => {
      ValidationHelper.localeService = MockService(TranslocoLocaleService);
      jest.spyOn(ValidationHelper, 'validateDateFormat').mockReturnValue(null);
      jest
        .spyOn(ValidationHelper.localeService, 'localizeDate')
        .mockReturnValue('11/23/2024');

      const result = getSpecialParseFunctions({
        alertTypes: mockOptions,
        regionOptions: mockOptions,
        salesAreaOptions: mockOptions,
        salesOrgOptions: mockOptions,
        sectorManagementOptions: mockOptions,
        demandPlannerOptions: mockOptions,
        gkamOptions: mockOptions,
        productLineOptions: mockOptions,
        intervalOpts: mockOptions,
        whenOpts: mockOptions,
        materialClassification: mockOptions,
      });

      let parseFunction = result.get('startDate');
      expect(parseFunction).toBeDefined();
      expect(parseFunction('2024-11-23')).toEqual('11/23/2024');

      parseFunction = result.get('endDate');
      expect(parseFunction).toBeDefined();
      expect(parseFunction('2024-11-23')).toEqual('11/23/2024');
    });
  });
});
