import { SalesIndication } from '../../../../../core/store/reducers/transactions/models/sales-indication.enum';

export class Selection {
  id: number;
  checked: boolean;
  translation: string;
  value: boolean | SalesIndication;
}
