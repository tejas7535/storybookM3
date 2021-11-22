import { LossOfSkillState } from '..';
import {
  getLostJobProfilesData,
  getLostJobProfilesLoading,
} from './loss-of-skill.selector';

describe('LossOfSkill Selector', () => {
  const fakeState: {
    lossOfSkill: LossOfSkillState;
  } = {
    lossOfSkill: {
      lostJobProfiles: {
        loading: true,
        data: [
          {
            job: 'Software Engineer',
            employees: [],
            leavers: [],
            openPositions: 1,
          },
        ],
        errorMessage: 'Fancy Error',
      },
    },
  };

  describe('getLostJobProfilesLoading', () => {
    it('should return true', () => {
      expect(getLostJobProfilesLoading(fakeState)).toBeTruthy();
    });
  });

  describe('getLostJobProfilesData', () => {
    it('should return the array of lost job profiles', () => {
      expect(getLostJobProfilesData(fakeState)).toEqual(
        fakeState.lossOfSkill.lostJobProfiles.data
      );
    });
  });
});
