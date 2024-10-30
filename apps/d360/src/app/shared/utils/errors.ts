import { translate } from '@jsverse/transloco';

import { HttpError, NetworkError } from './http-client';

/**
 * The details of a problem
 */
interface ProblemDetail {
  title: string;
  detail: string;
  code: string | null;
  values: Record<string, any> | null;
}

/**
 * Check if the given detail is a problem detail
 * @param detail The detail to check
 */
function isProblemDetail(detail: any): detail is ProblemDetail {
  if (!detail || typeof detail !== 'object') {
    return false;
  }

  return (
    typeof detail.title === 'string' &&
    typeof detail.detail === 'string' &&
    (detail.code === null || typeof detail.code === 'string') &&
    (detail.values === null || typeof detail.values === 'object')
  );
}

export type CustomErrorMessages = Record<
  string,
  (details: ProblemDetail) => string
>;

/**
 * Get the error message from the given error
 * @param e The error to get the message from
 * @param customMessages Custom error messages
 */
export function getErrorMessage(
  e: unknown,
  customMessages?: CustomErrorMessages
) {
  if (e instanceof HttpError) {
    return getHttpErrorMessage(e, customMessages);
  } else if (e instanceof NetworkError) {
    return translate('error.network_error', {});
  } else if (e instanceof Error) {
    return e.message;
  }

  return translate('error.unknown', {});
}

/**
 * Extract the error message from a HttpError
 * @param e The error to get the message from
 * @param customMessages Custom error messages
 */
function getHttpErrorMessage(
  e: HttpError,
  customMessages?: CustomErrorMessages
) {
  const details = e.details;

  if (isProblemDetail(details)) {
    const customMessageFn =
      customMessages && details.code && customMessages[details.code];
    if (customMessageFn) {
      return customMessageFn(details);
    }

    const message = [details.title, details.detail].filter(Boolean).join(': ');

    if (message) {
      return message;
    }

    if (details.code) {
      return translate('error.error_with_code', { code: details.code });
    }
  }

  return translate('error.unknown', {});
}
