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

export const ERROR_TEXT = '#A30F0C';

/* Chart colors */
export const CHART_PRIMARY = '#00893D';
export const CHART_SECONDARY = '#20617C';

export const CHART_HIGHLIGHT_INFO = '#1C98B5';
export const CHART_HIGHLIGHT_ERROR = '#CB0B15';

export const RADAR_CHART_REFERENCE_LINE = '#D0D0D0';
