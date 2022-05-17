/* eslint-disable no-prototype-builtins */
import { BomItem, RawMaterialAnalysis } from '../models';

/*
 * this utility method can be removed when the odata bom is the new default.
 */
export const addCostShareOfParent = (
  item: BomItem,
  selectedItem: BomItem
): BomItem =>
  item.hasOwnProperty('totalPricePerPc') &&
  selectedItem.hasOwnProperty('totalPricePerPc')
    ? {
        ...item,
        costShareOfParent: item.totalPricePerPc / selectedItem.totalPricePerPc,
      }
    : item;

export const extractRawMaterials = (bomItems: BomItem[]): BomItem[] =>
  bomItems?.filter(
    (item) =>
      item.materialCharacteristics?.type === 'ROH' && item.itemCategory === 'M'
  );

export const mapBomItemsToRawMaterialAnalyses = (
  rawMaterialBomItems: BomItem[]
): RawMaterialAnalysis[] => {
  const aggregatedRawMaterials: Map<string, RawMaterialAnalysis> = new Map();

  rawMaterialBomItems.forEach((bomItem) => {
    if (aggregatedRawMaterials.has(bomItem.materialDesignation)) {
      // aggregate existing
      const rawMaterialAnalysis = aggregatedRawMaterials.get(
        bomItem.materialDesignation
      );
      rawMaterialAnalysis.operatingWeight += bomItem.quantities.quantity;
      rawMaterialAnalysis.totalCosts += bomItem.costing.costAreaTotalValue;
    } else {
      const rawMaterialAnalysis: RawMaterialAnalysis = {
        materialDesignation: bomItem.materialDesignation,
        materialNumber: bomItem.materialNumber,
        costShare: undefined,
        supplier: bomItem.procurement.vendorDescription,
        operatingWeight: bomItem.quantities.quantity,
        unitOfWeight: bomItem.quantities.baseUnitOfMeasure,
        price: undefined,
        totalCosts: bomItem.costing.costAreaTotalValue,
        currency: bomItem.costing.costAreaCurrency,
      };

      aggregatedRawMaterials.set(
        rawMaterialAnalysis.materialDesignation,
        rawMaterialAnalysis
      );
    }
  });

  return [...aggregatedRawMaterials.values()];
};

export const addCostShareAndPriceValuesToRawMaterialAnalyses = (
  aggregatedRawMaterials: RawMaterialAnalysis[],
  selectedBomItem: BomItem
) =>
  aggregatedRawMaterials.map((analysis) => ({
    ...analysis,
    costShare: analysis.totalCosts / selectedBomItem.costing.costAreaTotalValue,
    price: calculatePricePerKg(
      analysis.totalCosts,
      analysis.operatingWeight,
      analysis.unitOfWeight
    ),
  }));

const calculatePricePerKg = (
  totalCosts: number,
  operatingWeight: number,
  unitOfDimension: string
): number =>
  unitOfDimension === 'G'
    ? (totalCosts / operatingWeight) * 1000
    : totalCosts / operatingWeight;

export const getRawMaterialAnalysisSummary = (
  rawMaterialAnalysisData: RawMaterialAnalysis[]
): RawMaterialAnalysis[] =>
  rawMaterialAnalysisData?.length > 0
    ? [
        {
          materialDesignation: undefined,
          materialNumber: undefined,
          costShare: undefined,
          supplier: undefined,
          operatingWeight: undefined,
          unitOfWeight: undefined,
          price: undefined,
          currency: rawMaterialAnalysisData[0].currency,
          totalCosts: rawMaterialAnalysisData
            .map((item) => item.totalCosts)
            .reduce((current: number, previous: number) => previous + current),
        },
      ]
    : undefined;
