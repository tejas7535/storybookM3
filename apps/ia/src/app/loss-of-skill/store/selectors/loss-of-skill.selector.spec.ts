import { LossOfSkillState } from '..';
import {
  getJobProfilesLoading,
  getLossOfSkillLeaversData,
  getLossOfSkillLeaversLoading,
  getLossOfSkillWorkforceData,
  getLossOfSkillWorkforceLoading,
} from './loss-of-skill.selector';

describe('LossOfSkill Selector', () => {
  const fakeState: {
    lossOfSkill: LossOfSkillState;
  } = {
    lossOfSkill: {
      jobProfiles: {
        loading: false,
        data: {
          lostJobProfiles: [
            {
              positionDescription: 'Software Engineer',
              employeesCount: 0,
              leaversCount: 0,
              openPositionsCount: 0,
            },
          ],
          responseModified: false,
        },
        errorMessage: 'Fancy Error',
      },
      workforce: {
        data: { employees: [], responseModified: false },
        errorMesssage: undefined,
        loading: false,
      },
      leavers: {
        data: { employees: [], responseModified: false },
        errorMesssage: undefined,
        loading: false,
      },
    },
  };

  describe('getJobProfilesLoading', () => {
    it('should return true if job profiles loading', () => {
      const state = {
        ...fakeState,
        lossOfSkill: {
          ...fakeState.lossOfSkill,
          jobProfiles: {
            ...fakeState.lossOfSkill.jobProfiles,
            loading: true,
          },
        },
      };
      expect(getJobProfilesLoading(state)).toBeTruthy();
    });

    it('should return false if job profiles loading', () => {
      expect(getJobProfilesLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getLostJobProfilesData', () => {});

  describe('getLossOfSkillWorkforceData', () => {
    test('should get data', () => {
      const result = getLossOfSkillWorkforceData(fakeState);

      expect(result).toBe(fakeState.lossOfSkill.workforce.data);
    });
  });

  describe('getLossOfSkillWorkforceLoading', () => {
    test('should get loading', () => {
      const result = getLossOfSkillWorkforceLoading(fakeState);

      expect(result).toBeFalsy();
    });
  });

  describe('getLossOfSkillLeaversData', () => {
    test('should get data', () => {
      const result = getLossOfSkillLeaversData(fakeState);

      expect(result).toBe(fakeState.lossOfSkill.leavers.data);
    });
  });

  describe('getLossOfSkillLeaversLoading', () => {
    test('should get loading', () => {
      const result = getLossOfSkillLeaversLoading(fakeState);

      expect(result).toBeFalsy();
    });
  });
});
