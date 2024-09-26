import { ComparableLinkedTransaction } from './comparable-linked-transaction.model';
import { RecommendationType } from './recommendation-type.enum';

export interface ComparableLinkedTransactionResponse {
  recommendationType: RecommendationType;
  comparableLinkedTransactions: ComparableLinkedTransaction[];
}
