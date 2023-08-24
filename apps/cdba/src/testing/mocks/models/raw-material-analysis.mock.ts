import { RawMaterialAnalysis } from '@cdba/shared/models';
import { UnitOfMeasure } from '@cdba/shared/models/unit-of-measure.model';

export const RAW_MATERIAL_ANALYSIS_MOCK: RawMaterialAnalysis = {
  materialDesignation: 'F-123455',
  materialNumber: '99923232-0000',
  costShare: 0.003,
  supplier: '',
  operatingUnit: 0.22,
  unitOfMeasure: UnitOfMeasure.G,
  price: 0.04,
  totalCosts: 0.000_73,
  totalPrice: 0.001,
  currency: 'EUR',
  uomBaseToPriceFactor: 1.234,
};
