import { Quotation } from '../../../shared/models';

export class TableContext {
  quotation: Quotation;
  onMultipleMaterialSimulation?: (valueId: string, value: number) => void;
}
