import { ComparableLinkedTransaction } from '../../transactions/models/comparable-linked-transaction.model';

export interface ExtendedComparableLinkedTransaction
  extends ComparableLinkedTransaction {
  itemId: number;
  inputMaterialDescription: string;
  inputMaterialNumber: string;
  inputQuantity: number;
  keyAccount: string;
  subKeyAccount: string;
  sector: string;
  subSector: string;
}
