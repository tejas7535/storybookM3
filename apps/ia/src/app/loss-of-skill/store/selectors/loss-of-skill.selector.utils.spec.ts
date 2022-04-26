/* eslint-disable unicorn/no-useless-undefined */
import { JobProfile, LostJobProfile, OpenPosition } from '../../models';
import {
  convertJobProfilesToLostJobProfiles,
  enrichLostJobProfilesWithOpenPositions,
} from './loss-of-skill.selector.utils';

describe('loss of skill selector utils', () => {
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

  describe('convertJobProfilesToLostJobProfiles', () => {
    test('should return undefined if job profiles are undefined', () => {
      const result = convertJobProfilesToLostJobProfiles(undefined);

      expect(result).toBeUndefined();
    });

    test('should return initialized lost job profiles from job profiles', () => {
      const result = convertJobProfilesToLostJobProfiles(jobProfiles);

      expect(result.length).toEqual(jobProfiles.length);
      expect(result[0].openPositions).toEqual(0);
    });
  });

  describe('enrichLostJobProfilesWithOpenPositions', () => {
    let lostJobProfiles: LostJobProfile[];

    beforeEach(() => {
      lostJobProfiles = jobProfiles.map((profile) => ({
        ...profile,
        openPositions: 0,
      }));
    });

    test('should return empty list if lost job profiles is undefined and open positions undefined', () => {
      const result = enrichLostJobProfilesWithOpenPositions(
        undefined,
        undefined
      );

      expect(result.length).toEqual(0);
    });

    test('should return lost job profiles if open positions are undefined', () => {
      const result = enrichLostJobProfilesWithOpenPositions(
        lostJobProfiles,
        undefined
      );

      expect(result).toEqual(lostJobProfiles);
    });

    test('should return empty list if lost job profiles undefined', () => {
      const result = enrichLostJobProfilesWithOpenPositions(
        undefined,
        openPositions
      );

      expect(result.length).toEqual(0);
    });

    test('should return merged open positions with lost job profiles', () => {
      const result = enrichLostJobProfilesWithOpenPositions(
        lostJobProfiles,
        openPositions
      );

      expect(result.length).toEqual(2);
      expect(result[0].openPositions).toEqual(1);
      expect(result[1].openPositions).toEqual(2);
    });
  });
});
