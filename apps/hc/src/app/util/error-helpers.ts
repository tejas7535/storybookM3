import { translate } from '@jsverse/transloco';

export const getErrorMessage = (errors: { [key: string]: any }): string => {
  if (!errors) {
    return undefined;
  }
  if (errors.required) {
    return getTranslatedError('required');
  }
  if (errors.min) {
    return getTranslatedError('min', { min: errors.min.min });
  }
  if (errors.max) {
    return getTranslatedError('max', { max: errors.max.max });
  }

  return getTranslatedError('generic');
};

const getTranslatedError = (key: string, params = {}): string =>
  translate(`formError.${key}`, params);
