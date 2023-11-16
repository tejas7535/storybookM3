import { schaefflerlogo } from '@ea/shared/constants/schaefflerlogo';
import jsPDF from 'jspdf';

import { DefaultComponentRenderProps, DocumentData } from '../data';

export const generateHeader = (
  doc: jsPDF,
  docSettings: DocumentData,
  props = DefaultComponentRenderProps
): number => {
  const logoHeight = 16;
  const logoWidth = 130;
  doc.addImage(
    schaefflerlogo,
    'png',
    props.dimensions.pageMargin,
    props.dimensions.pageMargin + 1,
    logoWidth,
    logoHeight
  );

  doc.setFontSize(7.3);

  const marketingText = docSettings.marketingText;
  const marketingTextWidth =
    doc.getStringUnitWidth(marketingText) * doc.getFontSize();

  const yMarketingText =
    props.dimensions.pageMargin + logoHeight / 2 - doc.getFontSize() / 2;
  doc.text(
    marketingText,
    doc.internal.pageSize.getWidth() -
      marketingTextWidth -
      props.dimensions.pageMargin,
    yMarketingText
  );
  const dateWidth =
    doc.getStringUnitWidth(docSettings.generationDate) * doc.getFontSize();
  doc.text(
    docSettings.generationDate,
    doc.internal.pageSize.getWidth() - dateWidth - props.dimensions.pageMargin,
    yMarketingText + 20
  );

  const reportHeadingY =
    logoHeight + props.dimensions.pageMargin + doc.getFontSize() + 25;
  const reportHeading = docSettings.reportHeading;

  doc.setFontSize(props.dimensions.reportTitleFontSize);
  doc.setFont(props.fonts.family, props.fonts.style.bold);
  doc.text(reportHeading, 21, reportHeadingY);

  return reportHeadingY - doc.getFontSize(); // TODO fix inconsistent spacing from bottom edge
};
