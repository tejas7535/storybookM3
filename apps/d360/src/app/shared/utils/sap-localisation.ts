import { translate } from '@jsverse/transloco';

import { ValidationHelper } from './validation/validation-helper';

export const messageClassId = '/SGD/SCM_SOP_SALES' as const;
export type MessageId = typeof messageClassId;

// The check which message numbers exist is useless because it is only compiletime.
// We don't know which number we get at runtime and we have fallback messages
type DummyForessageNumbers = '0';

export function messageFromSAP(
  fallbackMessage: string | null,
  messageNumber: number | null,
  messageId: string | null,
  messageV1: string | null,
  messageV2: string | null,
  messageV3: string | null,
  messageV4: string | null
): string {
  const messageClass = messageId as MessageId;
  const sapMessageNumber = messageNumber?.toString() as DummyForessageNumbers;
  const defaultErrorMessage =
    fallbackMessage ||
    translate('sap_message.error', {
      messageClass,
      messageNumber: sapMessageNumber,
    });

  const translatedError: string = translate(
    `sap_message.${messageClass}.${sapMessageNumber}`,
    {
      messageV1: checkForDateAndLocalize(messageV1) || '',
      messageV2: checkForDateAndLocalize(messageV2) || '',
      messageV3: checkForDateAndLocalize(messageV3) || '',
      messageV4: checkForDateAndLocalize(messageV4) || '',
    }
  );

  // If we have no "real" translation, we need to use the defaultErrorMessage
  return translatedError === `sap_message.${messageClass}.${sapMessageNumber}`
    ? defaultErrorMessage
    : translatedError;
}

function checkForDateAndLocalize(value: string | null): string | null {
  if (value && /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(value)) {
    return ValidationHelper.localeService?.localizeDate(
      new Date(Date.parse(value))
    );
  }

  return value;
}
