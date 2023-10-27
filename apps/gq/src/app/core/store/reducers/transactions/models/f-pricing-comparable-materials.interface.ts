import { ComparableLinkedTransaction } from './comparable-linked-transaction.model';

export interface FPricingComparableMaterials {
  similarityScore: number;
  material: Material;
  transactions: ComparableLinkedTransaction[];
}

export interface Material {
  materialNumber: string;
  materialDescription: string;
}

export interface ComparableMaterialsRowData
  extends ComparableLinkedTransaction {
  parentMaterialDescription: string;
  parentMaterialNumber: string;
  isShowMoreRow?: boolean;
}
