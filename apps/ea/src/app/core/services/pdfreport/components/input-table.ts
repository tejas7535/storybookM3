import { CalculationResultReportInput } from '@ea/core/store/models';
import jsPDF from 'jspdf';

import {
  DefaultComponentRenderProps,
  InputTableOptions,
  Spacing,
} from '../data';
import { getRealLineHeight, resetFont } from '../util';

export const renderInputTable = (
  doc: jsPDF,
  data: CalculationResultReportInput[],
  startY: number,
  startX: number,
  width: number,
  options: Partial<InputTableOptions>,
  props = DefaultComponentRenderProps
): number => {
  resetFont(doc);
  const textObjects = data.map((item) => {
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
  const widestLabel = Math.max(...textObjects.map((to) => to.labelWidth));

  const colWidth = [Math.floor(width / 2), Math.floor(width / 2)];
  if (widestLabel > colWidth[0] && widestLabel > width * 0.66) {
    colWidth[0] = Math.floor(width * 0.66);
    colWidth[1] = Math.ceil(width * 0.33);
  }

  const rectCornerRadius = 4;
  const headerSpacing = { left: 6, right: 6, top: 8, bottom: 8 } as Spacing;
  const cellSpacing = { left: 6, right: 6, top: 5, bottom: 5 } as Spacing; // top and bottom can't be symetrcial because of how the line height is handled

  let nextDrawLocation = startY;
  doc.setDrawColor(props.colors.tableBorderTextColor);
  const realLineHeight = getRealLineHeight(doc);

  let headerSize = 0;
  if (options.header) {
    doc.setFontSize(9);
    doc.text(
      options.header,
      startX + headerSpacing.left,
      nextDrawLocation + realLineHeight + headerSpacing.top
    );
    headerSize = realLineHeight + headerSpacing.top + headerSpacing.bottom;
    nextDrawLocation += headerSize;
    resetFont(doc);
  }
  const lineHeight = getRealLineHeight(doc);
  const cellHeights: number[] = [];

  const wrapOrReturn = (
    text: string,
    estimatedWidth: number,
    kind: 'label' | 'value'
  ): string[] => {
    const compWidth =
      colWidth[kind === 'label' ? 0 : 1] - cellSpacing.left - cellSpacing.right;
    if (estimatedWidth <= compWidth) {
      return [text];
    }

    return doc.splitTextToSize(text, compWidth);
  };

  for (const to of textObjects) {
    const printLabel = wrapOrReturn(`${to.label}`, to.labelWidth, 'label');
    const printValue = wrapOrReturn(`${to.value}`, to.valueWidth, 'value');
    const highestLine = Math.max(
      doc.getFontSize() * printLabel.length,
      doc.getFontSize() * printValue.length
    );
    const nextOffset = highestLine + cellSpacing.top + cellSpacing.bottom;

    doc.setFillColor(props.colors.mainGreenColor);
    doc.rect(
      startX,
      nextDrawLocation,
      colWidth[0] + cellSpacing.left + cellSpacing.right,
      nextOffset,
      'F'
    );
    doc.text(
      printLabel,
      startX + cellSpacing.left,
      nextDrawLocation + cellSpacing.top + lineHeight
    );
    doc.text(
      printValue,
      startX + 2 * cellSpacing.left + cellSpacing.right + colWidth[0],
      nextDrawLocation + cellSpacing.top + lineHeight
    );

    cellHeights.push(nextOffset);
    nextDrawLocation += nextOffset;
  }

  let prevY = startY + headerSize;

  for (let i = 0; i < cellHeights.length; i += 1) {
    if (i === cellHeights.length - 1) {
      break;
    }
    const yCoord = prevY + cellHeights[i];
    doc.line(startX, yCoord, startX + width, yCoord);
    prevY = yCoord;
  }

  if (headerSize !== 0) {
    doc.line(startX, startY + headerSize, startX + width, startY + headerSize);
  }
  // eslint-disable-next-line unicorn/no-array-reduce
  const tBodyHeight = cellHeights.reduce((acc, current) => {
    const ret = acc + current;

    return ret;
  }, 0);
  doc.roundedRect(
    startX,
    startY,
    width,
    tBodyHeight + headerSize,
    rectCornerRadius,
    rectCornerRadius
  );

  return tBodyHeight + headerSize;
};
