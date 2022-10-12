import { IdValue } from './id-value.model';

export interface ConfirmationModalData {
  displayText: string;
  icon: string;
  confirmButton: string;
  cancelButton: string;
  list?: IdValue[];
}
