import jsPDF from 'jspdf';

import { DefaultComponentRenderProps, DocumentData } from '../data';
import { getRealLineHeight, resetFont } from '../util';

export const renderCalculationMethods = (
  doc: jsPDF,
  methods: string[],
  yPosition: number,
  docSettings: DocumentData,
  props = DefaultComponentRenderProps
): number => {
  const calculations = methods;
  const verticalPadding = 8;
  const horizontalPadding = 17;
  const blockMargin = 8;

  let xCursor = props.dimensions.pageMargin;
  let yPos = yPosition;
  resetFont(doc);
  doc.setFontSize(11);
  doc.text(
    docSettings.calculationMethodsHeading,
    xCursor,
    yPos + doc.getFontSize() / 4
  );
  yPos += getRealLineHeight(doc) + props.dimensions.blockSpacing / 3;

  doc.setFontSize(9);
  for (const item of calculations) {
    const anticipatedWidth = doc.getStringUnitWidth(item) * doc.getFontSize();
    const containerWidth = anticipatedWidth + horizontalPadding;
    const rectHeight = doc.getFontSize() + verticalPadding;
    if (
      xCursor + containerWidth >
      doc.internal.pageSize.getWidth() - props.dimensions.pageMargin
    ) {
      xCursor = 21;
      yPos += rectHeight + blockMargin;
    }

    const x = xCursor;
    doc.roundedRect(
      x,
      yPos,
      containerWidth,
      rectHeight,
      rectHeight / 2,
      rectHeight
    );
    doc.text(
      item,
      x + horizontalPadding / 2,
      yPos + rectHeight / 2 + doc.getFontSize() / 4
    );
    xCursor += anticipatedWidth + horizontalPadding + blockMargin;
  }
  resetFont(doc);

  return yPos - yPosition + verticalPadding + doc.getFontSize();
};
