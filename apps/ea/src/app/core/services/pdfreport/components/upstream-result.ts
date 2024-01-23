import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import jsPDF from 'jspdf'; // eslint-disable-line import/no-extraneous-dependencies

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
import { LayoutBlock, LayoutEvaluationResult } from './render-types';

const DefaultUpstreamResultOptions: ResultTableAttributes = {
  headerSpacing: { top: 8, bottom: 8, left: 8, right: 8 },
  cellPadding: { top: 10, bottom: 10, left: 36, right: 36 },
  borderColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierSpacing: { left: 9, right: 9, top: 10, bottom: 10 },
};

export const renderUpstream = (
  doc: jsPDF,
  block: LayoutBlock<ResultBlock<ResultReportLargeItem>>
): LayoutEvaluationResult<ResultBlock<ResultReportLargeItem>>[] => {
  const options = DefaultUpstreamResultOptions;
  const style = DefaultComponentRenderProps;
  const width = getRealPageWidth(doc);
  const imageSize = 16;
  const y = block.yStart;
  const blockMargin = 12;
  const headerDivierY =
    y + imageSize + options.headerSpacing.top + options.headerSpacing.bottom;
  const startX = block.constraints.pageMargin;
  const headerHeight = headerDivierY - y;
  doc.setFont(style.fonts.family, style.fonts.style.bold);
  doc.setFontSize(10);
  if (!block.dryRun) {
    doc.addImage(
      block.data.icon,
      'png',
      startX + options.headerSpacing.left,
      y + options.headerSpacing.top,
      imageSize,
      imageSize
    );
    doc.text(
      block.data.header,
      startX + imageSize + 8 + options.headerSpacing.left,
      y + 1.5 * getRealLineHeight(doc) + imageSize / 2
    );

    doc.setDrawColor(style.colors.tableBorderTextColor);
    doc.line(
      style.dimensions.pageMargin,
      headerDivierY,
      style.dimensions.pageMargin + width,
      headerDivierY
    );
  }

  let bodyHeight = options.cellPadding.top + options.cellPadding.bottom;

  const [_valueWidth, valueHeight] = estimateTextDimensions(
    doc,
    `${block.data.data.value}`,
    { fontSize: 14 }
  );
  bodyHeight += valueHeight;

  const [_tw, titleHeight] = estimateTextDimensions(
    doc,
    `${block.data.data.title}`,
    { fontSize: doc.getFontSize() }
  );
  const [_dw, disclaimerHeight] = estimateTextDimensions(
    doc,
    `${block.data.data.title}`,
    { fontSize: doc.getFontSize() }
  ); // TODO change to the right value

  const chipHeight = renderChip(
    doc,
    block.data.data.short,
    startX + options.cellPadding.left,
    headerDivierY + options.cellPadding.top,
    {
      background: style.colors.chipColor,
      text: style.colors.chipTextColor,
    },
    block.dryRun
  );

  bodyHeight +=
    valueHeight + titleHeight + disclaimerHeight + chipHeight + 4 * blockMargin;

  const blockHeight = headerHeight + bodyHeight;
  if (!block.dryRun) {
    let printY = headerDivierY + chipHeight + 3 * blockMargin;
    const canvasX = startX + options.cellPadding.left;
    doc.setFontSize(14);
    const valueDimen = doc.getTextDimensions(`${block.data.data.value}`).w;
    doc.setFont(style.fonts.family, style.fonts.style.bold);
    doc.text(`${block.data.data.value}`, canvasX, printY);
    resetFont(doc);
    doc.text(`${block.data.data.unit}`, canvasX + valueDimen + 4, printY);
    printY += valueHeight + blockMargin;
    doc.text(`${block.data.data.title}`, canvasX, printY);
    printY += titleHeight + blockMargin;
    doc.text(`${block.blockProps.disclaimer}`, canvasX, printY);
    resetFont(doc);
    doc.setDrawColor(style.colors.tableBorderTextColor);
    doc.roundedRect(startX, y, width, blockHeight, 6, 6, 'S');
  }

  const ret: LayoutEvaluationResult<ResultBlock<ResultReportLargeItem>> =
    blockHeight <= block.maxHeight
      ? {
          canFit: true,
          verticalShift: block.yStart + headerHeight + bodyHeight,
          data: block.data,
        }
      : {
          canFit: false,
          data: block.data,
        };

  return [ret];
};
