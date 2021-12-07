import { JobProfile, OpenPosition } from '../../models';
import { LossOfSkillState } from '..';
import {
  getLostJobProfilesData,
  getLostJobProfilesLoading,
} from './loss-of-skill.selector';
import * as utils from './loss-of-skill.selector.utils';

jest.mock('./loss-of-skill.selector.utils', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  ...jest.requireActual<any>('./loss-of-skill.selector.utils'),
  convertJobProfilesToLostJobProfiles: jest.fn(() => []),
  enrichLostJobProfilesWithOpenPositions: jest.fn(() => []),
}));

describe('LossOfSkill Selector', () => {
  const fakeState: {
    lossOfSkill: LossOfSkillState;
  } = {
    lossOfSkill: {
      jobProfiles: {
        loading: false,
        data: [
          {
            positionDescription: 'Software Engineer',
            employees: [],
            leavers: [],
          },
        ],
        errorMessage: 'Fancy Error',
      },
      openPositions: {
        loading: false,
        data: [
          {
            positionDescription: 'Software Engineer',
          } as OpenPosition,
        ],
        errorMessage: 'Fancy Error',
      },
    },
  };

  describe('getLostJobProfilesLoading', () => {
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
      expect(getLostJobProfilesLoading(state)).toBeTruthy();
    });

    it('should return true if open positions loading', () => {
      const state = {
        ...fakeState,
        lossOfSkill: {
          ...fakeState.lossOfSkill,
          openPositions: {
            ...fakeState.lossOfSkill.openPositions,
            loading: true,
          },
        },
      };
      expect(getLostJobProfilesLoading(state)).toBeTruthy();
    });

    it('should return false if nothing loading', () => {
      expect(getLostJobProfilesLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getLostJobProfilesData', () => {
    let jobProfiles: JobProfile[];
    let openPositions: OpenPosition[];

    beforeEach(() => {
      jobProfiles = [
        {
          positionDescription: 'Developer',
          leavers: ['Hans', 'Peter'],
          employees: ['Thorsten'],
        },
        {
          positionDescription: 'PO',
          leavers: [],
          employees: ['Serge', 'Maria'],
        },
      ];
      openPositions = [
        {
          positionDescription: 'Developer',
        } as unknown as OpenPosition,
        {
          positionDescription: 'PO',
        } as unknown as OpenPosition,
        {
          positionDescription: 'PO',
        } as unknown as OpenPosition,
        {
          positionDescription: 'Scrum Master',
        } as unknown as OpenPosition,
      ];
    });

    test('should return lost job profiles from merge job profiles and open positions', () => {
      const result = getLostJobProfilesData.projector(
        jobProfiles,
        openPositions
      );

      expect(result).toBeDefined();
      expect(result.length).toEqual(0);
      expect(utils.convertJobProfilesToLostJobProfiles).toHaveBeenCalledWith(
        jobProfiles
      );
      expect(utils.enrichLostJobProfilesWithOpenPositions).toHaveBeenCalledWith(
        [],
        openPositions
      );
    });
  });
});
