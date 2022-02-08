import { CostShareCategory } from '../models';

export const COST_SHARE_CATEGORY_COLORS: Map<CostShareCategory, string> =
  new Map([
    ['highest', '#007832'],
    ['high', '#129B49'],
    ['medium', '#49B66B'],
    ['low', '#98D3A7'],
    ['lowest', '#E5F4E9'],
    ['negative', '#EFCCD2'],
  ]);
