/* eslint-disable unicorn/no-useless-undefined */
import { JobProfile, OpenPosition } from '../../models';
import { enrichJobProfilesWithOpenPositions } from './loss-of-skill.selector.utils';

describe('loss of skill selector utils', () => {
  let jobProfiles: JobProfile[];
  let openPositions: OpenPosition[];

  beforeEach(() => {
    jobProfiles = [
      {
        positionDescription: 'Developer',
        leaversCount: 2,
        employeesCount: 1,
      },
      {
        positionDescription: 'PO',
        employeesCount: 1,
        leaversCount: 0,
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

  describe('enrichJobProfilesWithOpenPositions', () => {
    test('should return empty list if lost job profiles is undefined and open positions undefined', () => {
      const result = enrichJobProfilesWithOpenPositions(undefined, undefined);

      expect(result.length).toEqual(0);
    });

    test('should return lost job profiles if open positions are undefined', () => {
      const result = enrichJobProfilesWithOpenPositions(jobProfiles, undefined);

      expect(result).toEqual(
        jobProfiles.map((profile) => ({ ...profile, openPositions: 0 }))
      );
    });

    test('should return empty list if lost jprofiles undefined', () => {
      const result = enrichJobProfilesWithOpenPositions(
        undefined,
        openPositions
      );

      expect(result.length).toEqual(0);
    });

    test('should return merged open positions with job profiles', () => {
      const result = enrichJobProfilesWithOpenPositions(
        jobProfiles,
        openPositions
      );

      expect(result.length).toEqual(2);
      expect(result[0].openPositions).toEqual(1);
      expect(result[1].openPositions).toEqual(2);
    });
  });
});
