import { Message } from './message.model';

export interface SelectedFile {
  error: boolean;
  file: File;
  data?: ArrayBuffer;
  removeFile: () => void;
  setManualProgress: (progress: number) => void;
  setMessage: (message: Message) => void;
}
