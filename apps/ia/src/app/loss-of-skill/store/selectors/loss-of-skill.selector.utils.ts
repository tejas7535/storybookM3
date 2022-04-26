import { JobProfile, LostJobProfile, OpenPosition } from '../../models';

export const convertJobProfilesToLostJobProfiles = (
  jobProfiles: JobProfile[]
): LostJobProfile[] =>
  jobProfiles?.map((jobProfile) => ({
    ...jobProfile,
    openPositions: 0,
  }));

export const enrichLostJobProfilesWithOpenPositions = (
  lostJobProfiles: LostJobProfile[],
  openPositions: OpenPosition[]
): LostJobProfile[] => {
  const profiles = lostJobProfiles ?? [];

  openPositions?.forEach((openPosition) => {
    const entry = profiles.find(
      (profile) =>
        profile.positionDescription === openPosition.positionDescription
    );
    if (entry) {
      entry.openPositions += 1;
    }
  });

  return profiles;
};
