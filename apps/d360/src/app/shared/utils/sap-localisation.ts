import { translate } from '@jsverse/transloco';

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

  return (
    translate(`sap_message.${messageClass}.${sapMessageNumber}`, {
      messageV1: messageV1 || '',
      messageV2: messageV2 || '',
      messageV3: messageV3 || '',
      messageV4: messageV4 || '',
    }) ?? defaultErrorMessage
  );
}
