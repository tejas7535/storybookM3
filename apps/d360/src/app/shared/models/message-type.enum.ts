export enum MessageType {
  Error = 'ERROR',
  Success = 'SUCCESS',
  Warning = 'WARNING',
}

export type MessageTypes =
  | MessageType.Error
  | MessageType.Success
  | MessageType.Warning;
