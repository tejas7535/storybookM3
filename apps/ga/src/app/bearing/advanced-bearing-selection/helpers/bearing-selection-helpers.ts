import { tooManyBearingsResultsThreshold } from '../constants';

export const isValidBearingSelection = (resultsCount: number): boolean =>
  resultsCount > 0 && resultsCount <= tooManyBearingsResultsThreshold;
