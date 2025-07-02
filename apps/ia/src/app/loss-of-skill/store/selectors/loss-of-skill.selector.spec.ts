import { LossOfSkillTab, PmgmDataResponse } from '../../models';
import { LossOfSkillState } from '..';
import {
  getJobProfilesData,
  getJobProfilesLoading,
  getLossOfSkillLeaversData,
  getLossOfSkillLeaversLoading,
  getLossOfSkillSelectedTab,
  getLossOfSkillWorkforceData,
  getLossOfSkillWorkforceLoading,
  getPmgmData,
} from './loss-of-skill.selector';

describe('LossOfSkill Selector', () => {
  const fakeState: {
    lossOfSkill: LossOfSkillState;
  } = {
    lossOfSkill: {
      selectedTab: LossOfSkillTab.PERFORMANCE,
      jobProfiles: {
        loading: false,
        data: {
          lostJobProfiles: [
            {
              jobKey: 'S1',
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
        errorMessage: undefined,
        loading: false,
      },
      leavers: {
        data: { employees: [], responseModified: false },
        errorMessage: undefined,
        loading: false,
      },
      pmgm: {
        data: {
          pmgmData: [{ employee: 'Helmans' }],
          responseModified: true,
        } as PmgmDataResponse,
        errorMessage: undefined,
        loading: false,
      },
    },
  };

  describe('getLossOfSkillSelectedTab', () => {
    it('should return the selected tab', () => {
      const result = getLossOfSkillSelectedTab.projector(fakeState.lossOfSkill);
      expect(result).toBe(LossOfSkillTab.PERFORMANCE);
    });
  });

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

  describe('getJobProfilesData', () => {
    test('should return job profiles data', () => {
      expect(getJobProfilesData(fakeState)).toEqual(
        fakeState.lossOfSkill.jobProfiles.data.lostJobProfiles
      );
    });
  });

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

  describe('getPmgmData', () => {
    test('should get data', () => {
      const result = getPmgmData(fakeState);

      expect(result).toBe(fakeState.lossOfSkill.pmgm.data.pmgmData);
    });
  });
});
