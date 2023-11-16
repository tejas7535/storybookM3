import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import jsPDF from 'jspdf';

import {
  DefaultComponentRenderProps,
  ResultBlock,
  ResultTableAttributes,
} from '../data';
import {
  estimateTextDimensions,
  getRealLineHeight,
  getRealPageWidth,
  resetFont,
} from '../util';
import { renderChip } from './chip';

const DefaultResultGridOptions: ResultTableAttributes = {
  headerSpacing: { top: 8, bottom: 8, left: 8, right: 8 },
  cellPadding: { top: 10, bottom: 10, left: 36, right: 36 },
  borderColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierSpacing: { left: 9, right: 9, top: 10, bottom: 10 },
};

export const renderResultGrid = (
  doc: jsPDF,
  data: ResultBlock<ResultReportLargeItem[]>,
  startX: number,
  startY: number,
  props = DefaultComponentRenderProps,
  options = DefaultResultGridOptions
): number => {
  const width = getRealPageWidth(doc);
  const imageSize = 16;
  const headerDivierY =
    startY +
    imageSize +
    options.headerSpacing.top +
    options.headerSpacing.bottom;
  const itemCols = [...data.data]
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce(
      (acc, curr) => {
        const lastIndex = acc.length - 1;
        acc[lastIndex].push(curr);
        if (acc[lastIndex].length === 2) {
          acc.push([]);
        }

        return acc;
      },
      [[]]
    )
    .filter((item) => item.length > 0);

  doc.setFont(props.fonts.family, props.fonts.style.bold);
  doc.setFontSize(10);

  const renderResultBlock = (
    item: ResultReportLargeItem,
    x: number,
    y: number,
    _canvasWidth: number,
    dryRun = false
  ): number => {
    // NOTE: No need to care about spacing, x,y and width are the actually usabble part of the canvas
    const chipMarginBottom = 6;
    const valueMarginBottom = 6;
    const titleMarginBottom = 6;
    const chipShift =
      renderChip(doc, item.short, x, y, {
        background: props.colors.chipColor,
        text: props.colors.chipTextColor,
      }) + chipMarginBottom;
    doc.setFont(props.fonts.family, props.fonts.style.bold);
    doc.setFontSize(14);
    const [valueWidth, valueHeight] = estimateTextDimensions(
      doc,
      `${item.value}`,
      { fontSize: 14 }
    );
    doc.text(`${item.value}`, x, y + chipShift + valueHeight);
    resetFont(doc);
    if (item.unit) {
      doc.setFontSize(10);
      if (!dryRun) {
        doc.text(item.unit, x + valueWidth + 6, y + chipShift + valueHeight);
      }
      resetFont(doc);
    }
    const titleYAxis =
      y + chipShift + valueHeight + getRealLineHeight(doc) + valueMarginBottom;

    if (!dryRun) {
      doc.text(item.title, x, titleYAxis); // TODO make proper spacing handling
    }

    return titleYAxis + titleMarginBottom - y;
  };

  if (!!data && !!data.icon) {
    doc.addImage(
      data.icon,
      'png',
      startX + options.headerSpacing.left,
      startY + options.headerSpacing.top,
      imageSize,
      imageSize
    );
  }
  doc.text(
    data.header,
    startX + imageSize + 8 + options.headerSpacing.left,
    startY + 1.5 * getRealLineHeight(doc) + imageSize / 2
  );
  doc.line(
    props.dimensions.pageMargin,
    headerDivierY,
    props.dimensions.pageMargin + width,
    headerDivierY
  );
  const rawColumnWidth = width / 2;
  const columnWidth =
    rawColumnWidth - options.cellPadding.left - options.cellPadding.right;

  const rowHeights: number[] = [];
  itemCols.forEach((row, cellY) => {
    const cellHeights: number[] = [];
    row.forEach((col, cellX) => {
      const xCellCoord =
        startX +
        (cellX + 1) * options.cellPadding.left +
        cellX * (columnWidth + options.cellPadding.right);
      const baseCellY =
        headerDivierY +
        (cellY + 1) * options.cellPadding.top +
        cellY * options.cellPadding.bottom;
      const resultRowHeights = rowHeights
        .slice(undefined, cellY)
        .reduce((acc, curr) => acc + curr, 0);
      const cellHeight = renderResultBlock(
        col,
        xCellCoord,
        baseCellY + resultRowHeights,
        columnWidth
      );

      cellHeights.push(cellHeight);
    });
    rowHeights.push(Math.max(...cellHeights));
  });
  doc.setDrawColor(props.colors.tableBorderTextColor);

  const totalHeight =
    rowHeights.reduce((acc, val) => acc + val, 0) +
    rowHeights.length * (options.cellPadding.top + options.cellPadding.bottom) +
    (headerDivierY - startY);
  doc.line(
    startX + rawColumnWidth,
    headerDivierY + options.divierSpacing.top,
    startX + rawColumnWidth,
    startY + totalHeight - options.divierSpacing.bottom
  );
  rowHeights.forEach((_height, idx) => {
    if (idx !== 0) {
      const offset =
        rowHeights.slice(undefined, idx).reduce((acc, curr) => acc + curr, 0) +
        idx * (options.cellPadding.bottom + options.cellPadding.top);
      doc.line(
        startX + options.divierSpacing.left,
        headerDivierY + offset,
        startX + width - options.divierSpacing.right,
        headerDivierY + offset
      );
    }
  });

  doc.roundedRect(startX, startY, width, totalHeight, 4, 4);
  resetFont(doc);

  return totalHeight;
};
