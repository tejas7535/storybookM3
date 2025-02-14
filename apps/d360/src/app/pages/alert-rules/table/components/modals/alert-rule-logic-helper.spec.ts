import { AlertRule } from '../../../../../feature/alert-rules/model';
import { Region } from '../../../../../feature/global-selection/model';
import { ThresholdsRequiredForAlertType } from './alert-rule-edit-single-modal/alert-rule-options-config';
import { checkAlertRuleData } from './alert-rule-logic-helper';

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
  it('does not give errors back for a correct alert rule', async () => {
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

    const errors = checkAlertRuleData(testRule, []);

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

    const errors = checkAlertRuleData(testRule, [thresholdRequirement]);

    expect(errors.length).toBe(0);
  });

  it('gives errors for missing required fields', async () => {
    const testRule: AlertRule = getTestRule({
      salesArea: 'DACH',
      type: 'CHKDMP',
      execDay: 'M01',
      startDate: new Date(),
      endDate: new Date(),
    });
    const errors = checkAlertRuleData(testRule, []);

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

  /* eslint-disable jest/no-commented-out-tests */
  // Key field check is no longer necessary as some of the key fields are mandatory for mass upload. Add this again if needed.
  // it('gives errors for missing key fields', async () => {
  //   const testRule: AlertRule = getTestRule({
  //     type: 'CHKDMP',
  //     region: 'EU',
  //     execInterval: 'M1',
  //     execDay: 'M01',
  //     startDate: new Date(),
  //     endDate: new Date(),
  //   });
  //   const errors = checkAlertRuleData(testRule, []);
  //
  //   expect(errors.length).toBe(1);
  //   expect(errors[0].errorMessage).toContain('at_least_one_of');
  // });

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

    const errors = checkAlertRuleData(testRule, [thresholdRequirement]);

    expect(errors.length).toBe(2);
    expect(errors[0].specificField).toBe('threshold2');
    expect(errors[0].errorMessage).toContain('missing');
    expect(errors[1].specificField).toBe('threshold3');
    expect(errors[1].errorMessage).toContain('missing');
  });

  it('gives errors back for interval and day not matching', async () => {
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

    const errors = checkAlertRuleData(testRule, []);

    expect(errors.length).toBe(1);
    expect(errors[0].errorMessage).toContain('execDay_not_valid');
  });
});
