import { LossOfSkillsState } from '..';
import {
  getLostJobProfilesData,
  getLostJobProfilesLoading,
} from './loss-of-skills.selector';

describe('LossOfSkills Selector', () => {
  const fakeState: {
    lossOfSkills: LossOfSkillsState;
  } = {
    lossOfSkills: {
      lostJobProfiles: {
        loading: true,
        data: [
          {
            job: 'Software Engineer',
            amountOfEmployees: 10,
            amountOfLeavers: 1,
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
        fakeState.lossOfSkills.lostJobProfiles.data
      );
    });
  });
});
