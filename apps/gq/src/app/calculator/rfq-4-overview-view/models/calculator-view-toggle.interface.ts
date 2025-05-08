import { ViewToggle } from '@schaeffler/view-toggle';

import { CalculatorTab } from './calculator-tab.enum';

export interface CalculatorViewToggle extends ViewToggle {
  tab: CalculatorTab;
}
