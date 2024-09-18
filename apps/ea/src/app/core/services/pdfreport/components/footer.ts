import jsPDF from 'jspdf';

import { DefaultComponentRenderProps, DocumentData } from '../data';
import { resetFont } from '../util';

export const generateFooter = (
  doc: jsPDF,
  page: number,
  totalPages: number,
  settings: DocumentData,
  props = DefaultComponentRenderProps
): number => {
  resetFont(doc);
  doc.setFontSize(props.dimensions.disclaimerFontSize);
  const blockMargin = props.dimensions.blockSpacing;
  const pageText = `${settings.page} ${page}/${totalPages}`;
  const pageCounterWidth = doc.getStringUnitWidth(pageText) * doc.getFontSize();
  const disclaimerWidth =
    doc.internal.pageSize.getWidth() -
    2 * props.dimensions.pageMargin -
    pageCounterWidth -
    blockMargin;

  const disclaimer = settings.documentDisclaimer;
  const disclaimerText = doc.splitTextToSize(disclaimer, disclaimerWidth);
  const disclaimerHeight = disclaimerText
    .map((line: string) => doc.getTextDimensions(line).h)
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((acc: number, curr: number) => {
      // eslint-disable-next-line unicorn/no-array-reduce
      let newValue = acc;
      newValue += curr;

      return newValue;
    }, 0);

  doc.text(
    disclaimerText,
    props.dimensions.pageMargin,
    doc.internal.pageSize.getHeight() -
      disclaimerHeight -
      props.dimensions.pageMargin
  );
  doc.text(
    pageText,
    props.dimensions.pageMargin + disclaimerWidth + blockMargin,
    doc.internal.pageSize.getHeight() -
      props.dimensions.pageMargin -
      doc.getFontSize()
  );
  resetFont(doc);

  return disclaimerHeight;
};
