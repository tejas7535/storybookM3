import { Status } from '@mac/msd/constants';

export const RECENT_DAYS = 14;

export const getStatus = (blocked: boolean, lastModified: number): Status => {
  if (blocked) {
    return Status.BLOCKED;
  }
  if (getRecentlyChanged(lastModified)) {
    return Status.CHANGED;
  }

  return Status.DEFAULT;
};

export const getRecentlyChanged = (lastModified: number): boolean => {
  const recentlyThreshold = Date.now() - RECENT_DAYS * 24 * 3600 * 1000;

  // * 1000 because the lastModified in our data is in seconds
  return lastModified * 1000 - recentlyThreshold > 0;
};
