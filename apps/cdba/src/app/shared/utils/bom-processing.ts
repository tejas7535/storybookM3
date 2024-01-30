/* eslint-disable no-prototype-builtins */
import { BomItem, RawMaterialAnalysis } from '../models';
import { UnitOfMeasure } from '../models/unit-of-measure.model';

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
      rawMaterialAnalysis.operatingUnit += bomItem.quantities.quantity;
      rawMaterialAnalysis.totalCosts += bomItem.costing.costAreaTotalValue;
    } else {
      const rawMaterialAnalysis: RawMaterialAnalysis = {
        materialDesignation: bomItem.materialDesignation,
        materialNumber: bomItem.materialNumber,
        costShare: undefined,
        supplier: bomItem.procurement.vendorDescription,
        operatingUnit: bomItem.quantities.quantity,
        unitOfMeasure:
          UnitOfMeasure[
            bomItem.quantities.baseUnitOfMeasure as keyof typeof UnitOfMeasure
          ] || UnitOfMeasure.UNRECOGNISED,
        uomBaseToPriceFactor:
          bomItem.materialCharacteristics.uomBaseToPriceFactor,
        price: undefined,
        totalCosts: bomItem.costing.costAreaTotalValue,
        totalPrice: bomItem.costing.costAreaTotalPrice,
        currency: bomItem.costing.costAreaCurrency,
      };

      rawMaterialAnalysis.unrecognisedUOM =
        rawMaterialAnalysis.unitOfMeasure === UnitOfMeasure.UNRECOGNISED
          ? bomItem.quantities.baseUnitOfMeasure
          : '';

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
    price: calculatePricePerUnit(
      analysis.totalCosts,
      analysis.operatingUnit,
      analysis.unitOfMeasure,
      analysis.uomBaseToPriceFactor,
      analysis.totalPrice
    ),
  }));

const calculatePricePerUnit = (
  totalCosts: number,
  operatingUnit: number,
  unitOfMeasure: string,
  uomBaseToPriceFactor: number,
  totalPrice: number
): number => {
  switch (unitOfMeasure) {
    case UnitOfMeasure.G:
      return operatingUnit !== 0 ? (totalCosts / operatingUnit) * 1000 : 0;
    case UnitOfMeasure.KG:
      return operatingUnit !== 0 ? totalCosts / operatingUnit : 0;
    case UnitOfMeasure.M:
      return totalPrice * uomBaseToPriceFactor;
    case UnitOfMeasure.MM:
      return totalPrice * uomBaseToPriceFactor;
    default:
      return 0;
  }
};

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
          operatingUnit: undefined,
          unitOfMeasure: undefined,
          uomBaseToPriceFactor: undefined,
          price: undefined,
          currency: rawMaterialAnalysisData[0].currency,
          totalCosts: rawMaterialAnalysisData
            .map((item) => item.totalCosts)
            .reduce((current: number, previous: number) => previous + current),
          totalPrice: undefined,
        },
      ]
    : undefined;
