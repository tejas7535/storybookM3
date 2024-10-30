import { translate } from '@jsverse/transloco';

import { messageFromSAP } from './sap-localisation';

/**
 * Result types for a write operation
 */
export type WriteResult = 'SUCCESS' | 'ERROR' | 'WARNING';

/**
 * The result of a post request
 */
export interface PostResult<T extends ResponseWithResultMessage> {
  overallStatus: WriteResult;
  overallErrorMsg: string | null;
  response: T[];
}

/**
 * The result of a post request with a single response
 */
export interface ResponseWithResultMessage {
  result: ResultMessage;
}

/**
 * The result message from the backend, used to build the FE error or success message
 */
export interface ResultMessage {
  messageType: WriteResult;
  messageClass: string | null;
  messageNumber: number | null;
  fallbackMessage: string | null;
  param1: string | null;
  param2: string | null;
  param3: string | null;
  param4: string | null;
}

/**
 * The result of a post request with a toast variant and message
 */
export interface ToastResult {
  variant: any; // TODO fix when notistack or schaeffler snackbar is available VariantType was the former type;
  message: string;
}

/**
 * Converts a single post result to a user message
 * @param result The result to convert
 * @param specificErrorToTextFn A function to convert a specific error to a text
 * @param successText The text to show if the result is a success
 */
export function singlePostResultToUserMessage<
  T extends ResponseWithResultMessage,
>(
  result: PostResult<T>,
  specificErrorToTextFn: (resultMsg: ResultMessage) => string,
  successText: string
): ToastResult {
  if (result.overallStatus === 'ERROR') {
    return {
      variant: 'error',
      message: result.overallErrorMsg || translate('error.unknown', {}),
    };
  }

  // There should be only one response, but the function can handle more than one. If there is one error, the result will be error.
  let errorMsg: string | null = null;
  let warningMsg: string | null = null;

  result.response.forEach((resp) => {
    const currResult = resp.result;
    if (currResult.messageType === 'ERROR') {
      const currErrorMsg = specificErrorToTextFn(currResult);
      errorMsg = errorMsg ? `${errorMsg}, ${currErrorMsg}` : currErrorMsg;
    }

    if (currResult.messageType === 'WARNING') {
      const currWarnMsg = specificErrorToTextFn(currResult);
      warningMsg = warningMsg ? `${warningMsg}, ${currWarnMsg}` : currWarnMsg;
    }
  });

  if (errorMsg) {
    return { variant: 'error', message: errorMsg };
  }
  if (warningMsg) {
    return { variant: 'warning', message: warningMsg };
  }

  return { variant: 'success', message: successText };
}

/**
 * Converts a multi post result to a user message array
 * @param result The result to convert
 * @param getCountedSuccessString A function to convert the count of success messages to a string
 * @param getCountedErrorString A function to convert the count of error messages to a string
 * @param getCountedWarningString A function to convert the count of warning messages to a string
 * @param additionalErrorCount An additional error count to add to the error count
 * @returns The user messages
 */
export function multiPostResultsToUserMessages<
  T extends ResponseWithResultMessage,
>(
  result: PostResult<T>,
  getCountedSuccessString: (count: number) => string,
  getCountedErrorString: (count: number) => string,
  getCountedWarningString: (count: number) => string,
  additionalErrorCount?: number
): ToastResult[] {
  if (result.overallStatus === 'ERROR') {
    return [
      {
        variant: 'error',
        message: result.overallErrorMsg || translate('error.unknown', {}),
      },
    ];
  }

  const successCount = result.response.filter(
    (msg) => msg.result.messageType === 'SUCCESS'
  ).length;
  const warningCount = result.response.filter(
    (msg) => msg.result.messageType === 'WARNING'
  ).length;
  const errorCount =
    result.response.filter((msg) => msg.result.messageType === 'ERROR').length +
    (additionalErrorCount ?? 0);

  const messages: ToastResult[] = [];
  if (successCount > 0) {
    messages.push({
      variant: 'success',
      message: getCountedSuccessString(successCount),
    });
  }
  if (warningCount > 0) {
    messages.push({
      variant: 'warning',
      message: getCountedWarningString(warningCount),
    });
  }
  if (errorCount > 0) {
    messages.push({
      variant: 'error',
      message: getCountedErrorString(errorCount),
    });
  }

  return messages;
}

/**
 * Function to get the translated message from the SAP message
 * @param resultMessage The result message from the backend
 */
export function errorsFromSAPtoMessage(resultMessage: ResultMessage): string {
  return messageFromSAP(
    resultMessage.fallbackMessage,
    resultMessage.messageNumber,
    resultMessage.messageClass,
    resultMessage.param1,
    resultMessage.param2,
    resultMessage.param3,
    resultMessage.param4
  );
}
