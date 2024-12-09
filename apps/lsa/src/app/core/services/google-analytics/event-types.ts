export interface BasicEvent {
  action: string;
  event: 'lsa_related_interaction';
}

export interface StepLoadEvent extends BasicEvent {
  step: number;
  step_name: string;
}

export interface RestultBaseEvent extends BasicEvent {
  step: 4;
  step_name: 'Result';
}

interface BaseProductPart {
  id: string; // material number
  name: string;
}

interface ProductPart extends BaseProductPart {
  quantity: number;
  is_recommended: boolean;
}

interface SelectedProductType {
  selected_product_type: 'Minimum' | 'Recommended';
}

export interface StepResultLoadEvent extends RestultBaseEvent {
  action: 'Step Load';
  min_prod: BaseProductPart;
  recom_prod: BaseProductPart;
}

export interface StepResultLoadFailEvent extends RestultBaseEvent {
  action: 'Step Load Fail';
}

export interface StepResultSupportLinkEvent extends RestultBaseEvent {
  action: 'Click to Support';
}

export interface ProductSelectionEvent
  extends RestultBaseEvent,
    SelectedProductType {
  action: 'Product Selection';
}

export interface DownloadReportEvent
  extends RestultBaseEvent,
    SelectedProductType {
  action: 'Download Report';
  product_parts: ProductPart[];
}

export interface ShareResultEvent
  extends RestultBaseEvent,
    SelectedProductType {
  action: 'Share';
  product_parts: ProductPart[];
}

export interface AddToCartEvent extends RestultBaseEvent, SelectedProductType {
  action: 'Add to Cart';
  selected_product_quantity: number;
  product_parts: ProductPart[];
}
