import { CalculationResultReportInput } from '@ea/core/store/models';
import jsPDF from 'jspdf';

import {
  DefaultDocumentColors,
  DefaultDocumentDimensions,
  Spacing,
} from '../data';
import { estimateTextDimensions, getRealLineHeight, resetFont } from '../util';
import { LayoutBlock, LayoutEvaluationResult } from './render-types';

interface tableItem {
  label: string;
  value: string;
  labelWidth: number;
  valueWidth: number;
}

const wrapOrReturn = (doc: jsPDF, text: string, maxWidth: number) => {
  const [width, _height] = estimateTextDimensions(doc, text, {
    fontSize: doc.getFontSize(),
  });

  return width <= maxWidth ? [text] : doc.splitTextToSize(text, maxWidth);
};

const renderTable = (
  doc: jsPDF,
  items: tableItem[],
  header: string,
  canvasX: number,
  canvasY: number,
  width: number,
  labelWidth: number,
  dryRun = false
) => {
  const rectCornerRadius = 4;
  const headerSpacing = { left: 6, right: 6, top: 8, bottom: 8 } as Spacing;
  const cellSpacing = { left: 6, right: 6, top: 5, bottom: 5 } as Spacing; // top and bottom can't be symetrcial because of how the line height is handled
  const startY = canvasY;
  doc.setDrawColor(DefaultDocumentColors.tableBorderTextColor);
  const maxLabelWidth = (width / 3) * 2 - cellSpacing.left - cellSpacing.right;
  doc.setFontSize(10);
  const headerLineHeight = doc.getTextDimensions(header).h;
  if (!dryRun) {
    doc.text(
      header,
      canvasX + headerSpacing.left,
      startY + headerSpacing.top + headerLineHeight
    );
  }
  const headerEndY =
    canvasY + headerLineHeight + headerSpacing.top + headerSpacing.bottom;
  resetFont(doc);
  const offsets: number[] = [];

  let nextRowLocation = headerEndY;

  const targetLabelWidth =
    labelWidth > maxLabelWidth ? maxLabelWidth : labelWidth;
  const targetValueWidth =
    labelWidth > maxLabelWidth
      ? width - maxLabelWidth - cellSpacing.left - cellSpacing.right
      : width - labelWidth;

  for (const item of items) {
    const labelText = wrapOrReturn(doc, item.label, targetLabelWidth);
    const valueText = wrapOrReturn(doc, item.value, targetValueWidth);
    const labelDimen = doc.getTextDimensions(labelText);
    const valueDimen = doc.getTextDimensions(valueText);

    const highestElement = Math.max(labelDimen.h, valueDimen.h);
    const nextOffset = highestElement + cellSpacing.top + cellSpacing.bottom;

    if (!dryRun) {
      doc.setFillColor(DefaultDocumentColors.mainGreenColor);
      doc.rect(
        canvasX,
        nextRowLocation,
        targetLabelWidth + cellSpacing.left + cellSpacing.right,
        nextOffset,
        'F'
      );
      doc.text(
        labelText,
        canvasX + cellSpacing.left,
        nextRowLocation +
          cellSpacing.top +
          doc.getLineHeight() / doc.getLineHeightFactor()
      );
      doc.text(
        valueText,
        canvasX + 2 * cellSpacing.left + cellSpacing.right + targetLabelWidth,
        nextRowLocation +
          cellSpacing.top +
          doc.getLineHeight() / doc.getLineHeightFactor()
      );
    }

    nextRowLocation += nextOffset;
    offsets.push(nextOffset);
  }

  const totalHeight = nextRowLocation - canvasY;

  if (!dryRun) {
    let nextDrawLocation = headerEndY;
    for (const offset of offsets.slice(undefined, -1)) {
      doc.line(
        canvasX,
        nextDrawLocation + offset,
        canvasX + width,
        nextDrawLocation + offset
      );
      nextDrawLocation += offset;
    }
    doc.roundedRect(
      canvasX,
      canvasY,
      width,
      totalHeight,
      rectCornerRadius,
      rectCornerRadius,
      'S'
    );
  }

  return totalHeight;
};

const flattenItems = (doc: jsPDF, items: CalculationResultReportInput[]) =>
  items.map((item) => {
    const key = item.designation;
    const value = item.value;
    const labelWidth = doc.getStringUnitWidth(key) * doc.getFontSize();

    const valueWidth = doc.getStringUnitWidth(`${value}`) * doc.getFontSize();

    return {
      label: key,
      value,
      labelWidth,
      valueWidth,
    };
  });

export const renderInputTable = (
  doc: jsPDF,
  block: LayoutBlock<CalculationResultReportInput[]>
) => {
  resetFont(doc);
  doc.setFontSize(DefaultDocumentDimensions.sectionTitleFontSize);
  const lineHeight = doc.getLineHeight();

  doc.text(
    [`${block.heading || 'Input'}`],
    block.constraints.pageMargin,
    block.yStart + lineHeight
  );
  doc.setFontSize(DefaultDocumentDimensions.textFontSize);
  const startY =
    block.yStart +
    getRealLineHeight(doc) +
    DefaultDocumentDimensions.blockSpacing;

  const colYs = [startY, startY];
  const width =
    doc.internal.pageSize.getWidth() - 2 * block.constraints.pageMargin - 12;

  const colWidth = width / 2;
  const colX = [
    block.constraints.pageMargin,
    block.constraints.pageMargin + colWidth + 12,
  ];
  const maxY = block.yStart + block.maxHeight;
  const tableConfiguration = block.data
    .filter((item) => !Array.isArray(item))
    .map((input) => ({
      heading: input.title,
      items: flattenItems(doc, input.subItems),
    }));
  const nestedItems = block.data.filter((item) => Array.isArray(item));
  const widestLabel = Math.max(
    ...tableConfiguration
      .flatMap((table) => table.items)
      .flatMap((item) => item.labelWidth)
  );

  const dataThatCanFit = [];
  let lastSuccesfulFit = -1;
  for (const [index, tc] of tableConfiguration.entries()) {
    const colIndex = colYs[0] <= colYs[1] ? 0 : 1;
    const tableShift = renderTable(
      doc,
      tc.items,
      tc.heading,
      colX[colIndex],
      colYs[colIndex],
      colWidth,
      widestLabel,
      block.dryRun
    );

    const newY = colYs[colIndex] + tableShift;
    if (newY <= maxY) {
      colYs[colIndex] = colYs[colIndex] + tableShift + 10;
      dataThatCanFit.push(block.data[index]);
      lastSuccesfulFit = index;
    } else {
      break;
    }
  }

  const results: LayoutEvaluationResult<typeof block.data>[] = [];
  const highestCol = Math.max(...colYs);
  const succesfulFits = block.data.slice(undefined, lastSuccesfulFit + 1);
  const failedFits = block.data
    .slice(lastSuccesfulFit + 1)
    .filter((a) => !Array.isArray(a));

  if (dataThatCanFit.length > 0) {
    results.push({
      canFit: true,
      verticalShift: highestCol,
      data: succesfulFits,
    });
  }

  const remainingData = [];

  if (nestedItems.length > 0) {
    remainingData.push(nestedItems.flat(2));
  }
  if (failedFits.length > 0) {
    remainingData.push(failedFits);
  }
  if (remainingData.length > 0) {
    results.push({
      canFit: false,
      data: remainingData.flat(),
    });
  }

  return results;
};
