import { RecalculationProcessAction } from '@gq/process-case-view/tabs/open-items-tab/open-items-table/modals/models/recalculation-process-action.enum';
import { QuotationDetail } from '@gq/shared/models';

export interface MenuItem {
  onClick: () => void;
  caption: string;
  disabled: boolean;
  classes?: string;
}

export function getMenuItem(
  onClickHandler: () => void,
  caption: string,
  classes?: string,
  disabled: boolean = false
): MenuItem {
  return {
    onClick: onClickHandler,
    caption,
    classes,
    disabled,
  };
}

export interface MenuItemConfig {
  process: RecalculationProcessAction;
  translationKey: string;
  disabled?: (quotationDetail: QuotationDetail) => boolean;
  cssClass?: string;
}
