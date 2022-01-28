export interface ConfirmationModalData {
  displayText: string;
  icon: string;
  confirmButton: string;
  cancelButton: string;
  list?: { id: string; value: string }[];
}
