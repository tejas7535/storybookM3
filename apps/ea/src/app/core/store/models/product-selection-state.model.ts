import {
  CatalogServiceProductClass,
  CatalogServiceTemplateCondition,
} from '@ea/core/services/catalog.service.interface';

import { Co2ApiSearchResult } from './co2-upstream-calculation-result-state.model';

export interface ProductSelectionState {
  bearingDesignation?: string;
  bearingId?: string;
  bearingResultList: Co2ApiSearchResult[];
  loading?: boolean;
  calculationModuleInfo?: {
    catalogueCalculation: boolean;
    frictionCalculation: boolean;
  };
  bearingProductClass?: CatalogServiceProductClass;
  error?: {
    catalogApi?: string;
    moduleInfoApi?: string;
  };
  co2DownstreamAvailable?: boolean;
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
