import {
  CatalogServiceProductClass,
  CatalogServiceTemplateCondition,
} from '@ea/core/services/catalog.service.interface';

export interface ProductSelectionState {
  bearingDesignation?: string;
  bearingId?: string;
  calculationModuleInfo?: {
    catalogueCalculation: boolean;
    frictionCalculation: boolean;
  };
  bearingProductClass?: CatalogServiceProductClass;
  error?: string;
  loadcaseTemplate?: ProductSelectionTemplate[];
  operatingConditionsTemplate?: ProductSelectionTemplate[];
}

export interface ProductSelectionTemplate {
  id: string;
  minimum: number | null;
  maximum: number | null;
  options: { value: string }[];
  precision: number;
  unit: string;
  defaultValue: string;
  visible: boolean | CatalogServiceTemplateCondition[];
  editable: boolean | CatalogServiceTemplateCondition[];
}
