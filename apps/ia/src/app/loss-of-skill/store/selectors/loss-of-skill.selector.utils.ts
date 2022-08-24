import { JobProfile, OpenPosition } from '../../models';

export const enrichJobProfilesWithOpenPositions = (
  jobProfiles: JobProfile[],
  openPositions: OpenPosition[]
): (JobProfile & { openPositions: number })[] => {
  const enrichedProfiles = jobProfiles?.map((profile) => ({
    ...profile,
    openPositions: 0,
  }));
  const profiles = enrichedProfiles ?? [];

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
