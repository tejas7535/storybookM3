import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import jsPDF from 'jspdf'; // eslint-disable-line import/no-extraneous-dependencies

import {
  DefaultComponentRenderProps,
  DefaultDocumentColors,
  DocumentFonts,
  ResultBlock,
  ResultTableAttributes,
} from '../data';
import { getRealLineHeight, resetFont, resetFontStyle } from '../util';
import { renderChip } from './chip';
import { LayoutBlock, LayoutEvaluationResult } from './render-types';

const DefaultResultGridOptions: ResultTableAttributes = {
  headerSpacing: { top: 8, bottom: 8, left: 8, right: 8 },
  cellPadding: { top: 10, bottom: 10, left: 36, right: 36 },
  borderColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierSpacing: { left: 9, right: 9, top: 10, bottom: 10 },
};

const getLoadcaseValueWidth = (
  doc: jsPDF,
  loadcase: ResultReportLargeItem['loadcaseValues'][0],
  unit?: string
) => {
  const unitWidth = unit ? doc.getTextDimensions(`${unit}`).w : 0;
  const valueWidth = doc.getTextDimensions(`${loadcase.value}`, {
    fontSize: 12,
  }).w;
  const nameWidth = doc.getTextDimensions(loadcase.loadcaseName).w;

  return Math.max(valueWidth + unitWidth + 4, nameWidth);
};

const singleLoadcaseRender = (
  doc: jsPDF,
  data: ResultReportLargeItem,
  startX: number,
  startY: number,
  _width: number,
  dryRun = false
): [number, number] => {
  const cellY = startY + DefaultResultGridOptions.cellPadding.top;
  const cellX = startX + DefaultResultGridOptions.cellPadding.left;
  let counterY = cellY;
  const chipHeight = renderChip(
    doc,
    data.short,
    cellX,
    cellY,
    {
      background: DefaultDocumentColors.chipColor,
      text: DefaultDocumentColors.chipTextColor,
    },
    dryRun
  );
  counterY += chipHeight + 6;

  doc.setFont(DocumentFonts.family, DocumentFonts.style.bold);
  doc.setFontSize(14);
  const headerLineHeight = doc.getLineHeight();
  const valueDimensions = doc.getTextDimensions(`${data.value}`);
  if (!dryRun) {
    doc.text(`${data.value}`, cellX, counterY + headerLineHeight);
  }
  doc.setFontSize(10);
  const unitWidth = data.unit ? doc.getTextDimensions(data.unit).w : 0;
  if (data.unit && !dryRun) {
    doc.text(
      data.unit,
      cellX + valueDimensions.w + 4,
      counterY + headerLineHeight
    );
  }

  resetFontStyle(doc);
  resetFont(doc);

  counterY += valueDimensions.h + 6;
  const titleLine = doc.getLineHeight();
  const titleDimensions = doc.getTextDimensions(data.title);
  if (!dryRun) {
    doc.text(data.title, cellX, counterY + titleLine);
  }
  counterY += titleLine + DefaultResultGridOptions.cellPadding.bottom;
  const totalWidth = Math.max(valueDimensions.w + unitWidth, titleDimensions.w);

  return [totalWidth, counterY - startY];
};

const multiLoadcaseRender = (
  doc: jsPDF,
  data: ResultReportLargeItem,
  startX: number,
  startY: number,
  width: number,
  dryRun = false
): [number, number] => {
  const cellY = startY + DefaultResultGridOptions.cellPadding.top;
  const cellX = startX + DefaultResultGridOptions.cellPadding.left;
  const chipHeight = renderChip(
    doc,
    data.short,
    cellX,
    cellY,
    {
      background: DefaultDocumentColors.chipColor,
      text: DefaultDocumentColors.chipTextColor,
    },
    dryRun
  );

  doc.setFontSize(8);

  const loadcases = data.loadcaseValues.map((lc) => ({
    ...lc,
    width: getLoadcaseValueWidth(doc, lc, data.unit),
  }));

  const lcWidths = loadcases.map((lc) => lc.width);
  const largestWidth = Math.max(...lcWidths);

  const calculatedNumberOfCols = Math.floor(width / largestWidth);
  const numberOfColumns =
    calculatedNumberOfCols > 3 ? 3 : calculatedNumberOfCols;

  const loadcaseCellPadding = 8;
  const loadcaseHeadingLineHeight = doc.getLineHeight();
  const loadcaseTitleLineHeight = doc.getTextDimensions('T', {
    fontSize: 10,
  }).h;
  const loadcaseBlockSpacing = 4;

  for (const [i, lc] of loadcases.entries()) {
    const col = i % numberOfColumns;
    const row = Math.floor(i / numberOfColumns);
    const colX = cellX + col * (largestWidth + loadcaseCellPadding);
    const colY = cellY + chipHeight + 6 + row * 34;

    if (!dryRun) {
      doc.text(lc.loadcaseName, colX, colY + loadcaseHeadingLineHeight);
    }
    doc.setFontSize(12);
    const valueLine = doc.getTextDimensions(`${lc.value}`);
    if (!dryRun) {
      doc.text(
        `${lc.value}`,
        colX,
        colY + loadcaseHeadingLineHeight + valueLine.h + loadcaseBlockSpacing
      );
    }
    resetFont(doc);
    if (!dryRun && data.unit) {
      doc.text(
        `${data.unit}`,
        colX + valueLine.w,
        colY + loadcaseHeadingLineHeight + valueLine.h + loadcaseBlockSpacing
      );
    }
  }
  resetFont(doc);
  resetFontStyle(doc);
  const numberOfRows = Math.ceil(loadcases.length / numberOfColumns);
  const dummyValueLine = doc.getTextDimensions('t', { fontSize: 12 }).h;

  const loadcaseHeight =
    loadcaseTitleLineHeight + loadcaseBlockSpacing + dummyValueLine;

  const titleBaseline =
    cellY +
    chipHeight +
    6 * numberOfRows +
    loadcaseHeight * numberOfRows +
    (loadcaseTitleLineHeight * numberOfRows + 4);
  if (!dryRun) {
    doc.text(data.title, cellX, titleBaseline);
  }

  return [
    -1,
    titleBaseline + DefaultResultGridOptions.cellPadding.bottom - startY,
  ];
};

export const renderResultGrid = (
  doc: jsPDF,
  block: LayoutBlock<ResultBlock<ResultReportLargeItem[]>>
) => {
  const startY = block.yStart;
  const maxYCoordinate = block.yStart + block.maxHeight;
  const startX = block.constraints.pageMargin;
  const width =
    doc.internal.pageSize.getWidth() - 2 * block.constraints.pageMargin;
  const rawColWidth = width / 2;
  const imageSize = 16;
  const headerDivierY =
    startY +
    imageSize +
    DefaultResultGridOptions.headerSpacing.top +
    DefaultResultGridOptions.headerSpacing.bottom;
  const evaluations: LayoutEvaluationResult<typeof block.data>[] = [];

  const blockData = block.data.data.map((entry) =>
    entry.loadcaseValues?.length === 1
      ? { ...entry, value: entry.loadcaseValues[0].value }
      : entry
  );

  doc.setDrawColor(DefaultDocumentColors.tableBorderTextColor);
  doc.setFont(DocumentFonts.family, DocumentFonts.style.bold);
  doc.setFontSize(10);

  if (!block.dryRun) {
    doc.addImage(
      block.data.icon,
      'png',
      startX + DefaultResultGridOptions.headerSpacing.left,
      startY + DefaultResultGridOptions.headerSpacing.top,
      imageSize,
      imageSize
    );
    doc.text(
      block.data.header,
      startX + imageSize + 8 + DefaultResultGridOptions.headerSpacing.left,
      startY + 1.5 * getRealLineHeight(doc) + imageSize / 2
    );
    doc.line(startX, headerDivierY, startX + width, headerDivierY);
  }
  resetFontStyle(doc);
  resetFont(doc);

  const colX = [
    block.constraints.pageMargin,
    block.constraints.pageMargin + rawColWidth,
  ];
  const colY = [headerDivierY, headerDivierY];
  const successfulFits: ResultReportLargeItem[] = [];
  const failedFits: ResultReportLargeItem[] = [];

  const rowHeights: number[] = [];
  let currentRowHeights: number[] = [];
  let failedOnce = false;

  for (const [i, item] of blockData.entries()) {
    if (failedOnce) {
      failedFits.push(item);
      continue;
    }

    const cellIndex = i % 2;
    const cellY = colY[cellIndex];
    const cellX = colX[cellIndex];

    const isSingleLoadcase = item.value !== undefined && item.value !== null;
    const renderer = isSingleLoadcase
      ? singleLoadcaseRender
      : multiLoadcaseRender;

    const [_rWidth, rHeight] = renderer(
      doc,
      item,
      cellX,
      cellY,
      rawColWidth,
      block.dryRun
    );
    const newYCol = colY[cellIndex] + rHeight;
    if (newYCol <= maxYCoordinate) {
      currentRowHeights.push(rHeight);
      successfulFits.push(item);
      colY[cellIndex] = newYCol;
      if (currentRowHeights.length === 2) {
        rowHeights.push(Math.max(...currentRowHeights));
        currentRowHeights = [];
      }
    } else {
      failedOnce = true;
      failedFits.push(item);
    }
  }

  if (currentRowHeights.length > 0) {
    rowHeights.push(Math.max(...currentRowHeights));
    currentRowHeights = [];
  }

  let height = 0;
  for (const h of rowHeights) {
    height += h;
  }

  height += headerDivierY - startY;
  doc.setDrawColor(DefaultDocumentColors.tableBorderTextColor);
  if (!block.dryRun) {
    doc.roundedRect(startX, startY, width, height, 6, 6, 'S');
  }

  if (successfulFits.length > 0) {
    const resultblock = { ...block.data, data: successfulFits };
    evaluations.push({
      verticalShift: block.yStart + height,
      canFit: true,
      data: resultblock,
    });
  }

  if (failedFits.length > 0) {
    const resultblock = { ...block.data, data: failedFits };
    evaluations.push({ canFit: false, data: resultblock });
  }

  return evaluations;
};
