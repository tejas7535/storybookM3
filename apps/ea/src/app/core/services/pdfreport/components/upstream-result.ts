import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import jsPDF from 'jspdf';

import {
  DefaultComponentRenderProps,
  DocumentData,
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

const DefaultUpstreamResultOptions: ResultTableAttributes = {
  headerSpacing: { top: 8, bottom: 8, left: 8, right: 8 },
  cellPadding: { top: 10, bottom: 10, left: 36, right: 36 },
  borderColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierSpacing: { left: 9, right: 9, top: 10, bottom: 10 },
};

export const renderUpstreamResult = (
  doc: jsPDF,
  result: ResultBlock<ResultReportLargeItem>,
  startX: number,
  startY: number,
  docSettings: DocumentData,
  props = DefaultComponentRenderProps,
  options = DefaultUpstreamResultOptions
): number => {
  const chipMarginBottom = 12;
  const blockMargin = 12;
  const width = getRealPageWidth(doc);
  const imageSize = 16;
  const headerDivierY =
    startY +
    imageSize +
    options.headerSpacing.top +
    options.headerSpacing.bottom;

  let y = startY;
  doc.setFont(props.fonts.family, props.fonts.style.bold);
  doc.setFontSize(10);
  doc.addImage(
    result.icon,
    'png',
    startX + options.headerSpacing.left,
    startY + options.headerSpacing.top,
    imageSize,
    imageSize
  );
  doc.text(
    result.header,
    startX + imageSize + 8 + options.headerSpacing.left,
    startY + 1.5 * getRealLineHeight(doc) + imageSize / 2
  );
  doc.setDrawColor(props.colors.tableBorderTextColor);
  doc.line(
    props.dimensions.pageMargin,
    headerDivierY,
    props.dimensions.pageMargin + width,
    headerDivierY
  );
  y = headerDivierY + options.cellPadding.top;
  const canvasX = startX + options.cellPadding.left;
  y =
    y +
    chipMarginBottom +
    blockMargin +
    renderChip(doc, result.data.short, canvasX, y, {
      background: props.colors.chipColor,
      text: props.colors.chipTextColor,
    });

  doc.setFontSize(14);
  doc.setFont(props.fonts.family, props.fonts.style.bold);
  const [valueWidth, valueHeight] = estimateTextDimensions(
    doc,
    `${result.data.value}`,
    { fontSize: 14 }
  );
  doc.text(`${result.data.value}`, canvasX, y);
  resetFont(doc);
  doc.text(result.data.unit, canvasX + valueWidth + 6, y);
  y += valueHeight + blockMargin;
  doc.text(result.data.title, canvasX, y);

  y += getRealLineHeight(doc) + blockMargin;
  doc.text(docSettings.co2disclaimer, canvasX, y);
  y += getRealLineHeight(doc) + blockMargin + options.cellPadding.bottom;

  doc.setDrawColor(props.colors.tableBorderTextColor);

  doc.roundedRect(startX, startY, width, y - startY, 6, 6, 'S');

  return y - startY;
};
