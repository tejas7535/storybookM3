/**
 * Generates an url with the search params for 'search' and 'language' and
 * uses the encodeURI method for replacing special characters with UTF-8 replacements
 * @param url
 * @param searchTerm
 * @param language
 */
export function generateUrlWithSearchTerm(
  url: string,
  searchTerm: string,
  language?: string
): string {
  return language
    ? `${url}?${new URLSearchParams({ search: searchTerm, language })}`
    : `${url}?${new URLSearchParams({ search: searchTerm })}`;
}

export class HttpError extends Error {
  statusCode: number;
  details: unknown;

  constructor(statusCode: number, details: unknown) {
    super(`HttpError: ${statusCode}`);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NetworkError extends Error {}

export class RequestAbortedError extends Error {}
