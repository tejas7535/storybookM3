import { AttritionDialogFluctuationMeta } from './attrition-dialog-fluctuation-meta.model';

export interface AttritionDialogMeta {
  data: AttritionDialogFluctuationMeta;
  selectedTimeRange: string;
  showAttritionRates: boolean;
}
