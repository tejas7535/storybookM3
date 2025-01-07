import { translate } from '@jsverse/transloco';

import { downstreamErrors } from '../constants/downstream-errors';

export const parseErrorObject = (errors: {
  [key: string]: string;
}): string[] => [
  ...new Set(
    Object.values(errors)
      .flat()
      .map((error) =>
        translate(getDownstreamErrorTranslationKey(parseErrorMessage(error)))
      )
      .filter(Boolean)
  ).values(),
];

export const getDownstreamErrorTranslationKey = (error: string): string => {
  if (!(error in downstreamErrors)) {
    return 'calculationResult.downstreamErrors.genericError';
  }

  return `calculationResult.downstreamErrors.${downstreamErrors[error]}`;
};

const parseErrorMessage = (message: string): string | undefined => {
  if (!message.replaceAll('TBD:', '').includes(':')) {
    return undefined;
  }

  return message.split(':')[0].trim();
};
