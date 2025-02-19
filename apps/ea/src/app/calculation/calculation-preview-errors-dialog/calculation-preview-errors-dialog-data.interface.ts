import { CalculationResultPreviewItem } from '@ea/core/store/models';

export interface CalculationPreviewErrorsDialogData {
  title: string;
  downstreamPreviewItems: CalculationResultPreviewItem[];
  downstreamErrors: string[];
  catalogPreviewItems: CalculationResultPreviewItem[];
  catalogErrors: string[];
}
