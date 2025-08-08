import { ComparisonType } from '../constants/comparison-type';
import { ReferenceTypeIdentifier } from './reference-type-identifier.model';

export class ComparableItemIdentifier {
  constructor(
    public referenceTypeIdentifier: ReferenceTypeIdentifier,
    public selectedCalculationId?: string
  ) {}
}

export class Comparison {
  constructor(
    public summary?: ComparisonSummary,
    public details?: ComparisonDetail[],
    public currency?: string
  ) {}
}

export class CostDifference {
  constructor(
    public type: ComparisonType,
    public valueBom1: number,
    public valueBom2: number,
    public costDeltaPercentage: number,
    public costDeltaValue: number,
    public title?: string
  ) {}
}

export class ComparisonSummary {
  constructor(
    public firstMaterialDesignation: string,
    public secondMaterialDesignation: string,
    public costDifferences: CostDifference[]
  ) {}
}
export class ComparisonDetail {
  constructor(
    public title: string,
    public totalCosts: number,
    public costSharePercentage: number,
    public costDifferences: CostDifference[]
  ) {}
}
