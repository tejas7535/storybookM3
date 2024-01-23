import jsPDF from 'jspdf'; // eslint-disable-line import/no-extraneous-dependencies

import { DefaultDocumentDimensions } from '../data';
import { getRealLineHeight, resetFont } from '../util';
import { LayoutBlock, LayoutEvaluationResult } from './render-types';

export const renderCalculationMethods = (
  doc: jsPDF,
  block: LayoutBlock<string[]>
) => {
  const calculations = block.data;
  const verticalPadding = 8;
  const horizontalPadding = 17;
  const blockMargin = 8;
  const pageMargin = block.constraints.pageMargin;

  let xCursor = block.constraints.pageMargin;
  let yPos = block.yStart;

  if (!block.dryRun) {
    resetFont(doc);
    doc.setFontSize(DefaultDocumentDimensions.sectionTitleFontSize);
    const lineHeight = doc.getLineHeight();
    doc.text([`${block.heading || 'Error'}`], xCursor, yPos + lineHeight);
    yPos += getRealLineHeight(doc) + blockMargin / 3;
  }
  doc.setFontSize(DefaultDocumentDimensions.textFontSize);
  const rectHeight = doc.getFontSize() + verticalPadding;
  const methodLineHeight = doc.getLineHeight();
  for (const item of calculations) {
    const anticipatedWidth = doc.getStringUnitWidth(item) * doc.getFontSize();
    const containerWidth = anticipatedWidth + horizontalPadding;
    if (
      xCursor + containerWidth >
      doc.internal.pageSize.getWidth() - pageMargin
    ) {
      xCursor = 21;
      yPos += rectHeight + blockMargin;
    }

    const x = xCursor;
    if (!block.dryRun) {
      doc.roundedRect(
        x,
        yPos + methodLineHeight,
        containerWidth,
        rectHeight,
        rectHeight / 2,
        rectHeight
      );
      doc.text(
        item,
        x + horizontalPadding / 2,
        yPos + rectHeight / 2 + methodLineHeight * doc.getLineHeightFactor()
      );
    }
    xCursor += anticipatedWidth + horizontalPadding + blockMargin;
  }
  resetFont(doc);

  const ret: LayoutEvaluationResult<typeof block.data>[] = [
    {
      canFit: true,
      verticalShift: yPos + rectHeight + verticalPadding + doc.getFontSize(),
      data: block.data,
    },
  ];

  return ret;
};
