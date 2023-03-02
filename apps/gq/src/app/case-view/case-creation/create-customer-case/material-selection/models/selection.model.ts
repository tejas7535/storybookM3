import { SalesIndication } from '@gq/core/store/reducers/models';

export class Selection {
  id: number;
  checked: boolean;
  translation: string;
  value: boolean | SalesIndication;
}
