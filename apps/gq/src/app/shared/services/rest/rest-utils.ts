// Helper method to use withCache for POST requests
export const requestBodyToHashCode = <T>(requestBody: T): string => {
  // https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
  const convertedRequestBody = JSON.stringify(requestBody);

  return [...convertedRequestBody]
    .reduce(
      // eslint-disable-next-line no-bitwise
      (hash, char) => char.codePointAt(0) + (hash << 6) + (hash << 16) - hash,
      0
    )
    .toString();
};
