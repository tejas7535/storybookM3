import { Employee } from '../../../shared/models';
import { LostJobProfilesResponse, OpenPosition } from '../../models';
import { LossOfSkillState } from '..';
import {
  getLostJobProfilesData,
  getLostJobProfilesLoading,
} from './loss-of-skill.selector';
import * as utils from './loss-of-skill.selector.utils';

jest.mock('./loss-of-skill.selector.utils', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  ...jest.requireActual<any>('./loss-of-skill.selector.utils'),
  enrichJobProfilesWithOpenPositions: jest.fn(() => []),
}));

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
              employees: [],
              leavers: [],
              employeesCount: 0,
              leaversCount: 0,
            },
          ],
          responseModified: false,
        },
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
    let jobProfiles: LostJobProfilesResponse;
    let openPositions: OpenPosition[];

    beforeEach(() => {
      jobProfiles = {
        lostJobProfiles: [
          {
            positionDescription: 'Developer',
            leavers: [
              { employeeName: 'Hans' } as Employee,
              { employeeName: 'Peter' } as Employee,
            ],
            leaversCount: 2,
            employeesCount: 1,
            employees: [{ employeeName: 'Thorsten' } as Employee],
          },
          {
            positionDescription: 'PO',
            leavers: [],
            leaversCount: 0,
            employeesCount: 2,
            employees: [
              { employeeName: 'Serge' } as Employee,
              { employeeName: 'Maria' } as Employee,
            ],
          },
        ],
        responseModified: false,
      };
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
        openPositions,
        false,
        false
      );

      expect(result).toBeDefined();
      expect(result.length).toEqual(0);
      expect(utils.enrichJobProfilesWithOpenPositions).toHaveBeenCalledWith(
        jobProfiles.lostJobProfiles,
        openPositions
      );
    });
  });
});
