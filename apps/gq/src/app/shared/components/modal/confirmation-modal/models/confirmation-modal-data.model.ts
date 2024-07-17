import { IdValue } from './id-value.model';

export interface ConfirmationModalData {
  title: string;
  subtitle?: string;
  contentList?: IdValue[];
  infoBannerText?: string;
  confirmButtonIcon: string;
  confirmButtonText: string;
  cancelButtonText: string;
}
