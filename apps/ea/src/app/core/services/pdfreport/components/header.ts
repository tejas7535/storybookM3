import { schaefflerlogo } from '@ea/shared/constants/schaefflerlogo';
import jsPDF from 'jspdf'; // eslint-disable-line import/no-extraneous-dependencies

import {
  ComponentRenderProps,
  DefaultComponentRenderProps,
  DefaultDocumentColors,
  DocumentData,
} from '../data';
import { getStringContentWidth } from '../util';

interface Coordinates {
  x: number;
  y: number;
}

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

  doc.setFontSize(8);
  const linkResult = generateBearingLink(doc, docSettings, props, logoHeight);

  const date = docSettings.generationDate;
  const xCoordinate = getRightSideElementX(doc, date, props);

  doc.text(docSettings.generationDate, xCoordinate, linkResult.y + 20);

  const reportHeadingY =
    logoHeight + props.dimensions.pageMargin + doc.getFontSize() + 25;
  const reportHeading = docSettings.reportHeading;

  doc.setFontSize(props.dimensions.reportTitleFontSize);
  doc.setFont(props.fonts.family, props.fonts.style.bold);
  doc.text(reportHeading, 21, reportHeadingY);

  return reportHeadingY - doc.getFontSize(); // TODO fix inconsistent spacing from bottom edge
};

const generateBearingLink = (
  doc: jsPDF,
  docSettings: DocumentData,
  props: ComponentRenderProps,
  logoHeight: number
): Coordinates => {
  const documentColor = doc.getTextColor();
  const text = docSettings.bearingLink.text;
  const link = docSettings.bearingLink.link;

  const xCoordinate = getRightSideElementX(doc, text, props);
  const yCoordinate =
    props.dimensions.pageMargin + logoHeight / 2 - doc.getFontSize() / 2;

  doc.setTextColor(DefaultDocumentColors.darkGreenColor);
  doc.textWithLink(text, xCoordinate, yCoordinate, { url: link });
  doc.setTextColor(documentColor);

  return {
    x: xCoordinate,
    y: yCoordinate,
  };
};

const getRightSideElementX = (
  doc: jsPDF,
  content: string,
  props: ComponentRenderProps
): number => {
  const contentWidth = getStringContentWidth(doc, content);
  const xCoordinate =
    doc.internal.pageSize.getWidth() -
    contentWidth -
    props.dimensions.pageMargin;

  return xCoordinate;
};
