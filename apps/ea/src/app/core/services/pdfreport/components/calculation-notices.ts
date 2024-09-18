import { WarningIcon } from '@ea/shared/constants/pdf-icons';
import jsPDF from 'jspdf';

import {
  DefaultComponentRenderProps,
  Notices,
  ResultBlock,
  ResultTableAttributes,
} from '../data';
import { estimateTextDimensions, getRealLineHeight, resetFont } from '../util';
import { LayoutBlock, LayoutEvaluationResult } from './render-types';

const RenderNoticesDefaultOptions: ResultTableAttributes = {
  headerSpacing: { top: 8, bottom: 8, left: 8, right: 8 },
  cellPadding: { top: 18, bottom: 18, left: 36, right: 36 },
  borderColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierSpacing: { left: 9, right: 9, top: 10, bottom: 10 },
};

const headerSpacing = 4;
const headingSize = 10;

export const renderNotices = (
  doc: jsPDF,
  block: LayoutBlock<ResultBlock<Notices>>
) => {
  const props = DefaultComponentRenderProps;
  const options = RenderNoticesDefaultOptions;
  const width =
    doc.internal.pageSize.getWidth() - 2 * props.dimensions.pageMargin;
  const innerWidth =
    width - options.cellPadding.left - options.cellPadding.right;
  const imageSize = 16;
  const headerDivierY =
    block.yStart +
    imageSize +
    options.headerSpacing.top +
    options.headerSpacing.bottom;
  let y = block.yStart;

  if (!block.dryRun) {
    doc.setFont(props.fonts.family, props.fonts.style.bold);
    doc.setFontSize(10);
    doc.addImage(
      WarningIcon,
      'png',
      props.dimensions.pageMargin + options.headerSpacing.left,
      block.yStart + options.headerSpacing.top,
      imageSize,
      imageSize
    );
    doc.text(
      block.data.header,
      props.dimensions.pageMargin + imageSize + 8 + options.headerSpacing.left,
      block.yStart + 1.5 * getRealLineHeight(doc) + imageSize / 2
    );
    doc.line(
      props.dimensions.pageMargin,
      headerDivierY,
      props.dimensions.pageMargin + width,
      headerDivierY
    );
  }

  y = headerDivierY + options.cellPadding.top;
  resetFont(doc);

  const errors = getItemLines(doc, block.data.data.errors.data, innerWidth);
  const warnings = getItemLines(doc, block.data.data.warnings.data, innerWidth);
  const notices = getItemLines(doc, block.data.data.notes.data, innerWidth);

  const totalHeight = getLinesHeight(doc, [...errors, ...warnings, ...notices]);
  const headersHeight = getHeadersHeight(block.data.data);

  const borderHeight =
    headerDivierY -
    block.yStart +
    2 * options.cellPadding.top +
    totalHeight +
    options.cellPadding.bottom +
    headersHeight;
  if (!block.dryRun) {
    doc.roundedRect(
      props.dimensions.pageMargin,
      block.yStart,
      width,
      borderHeight,
      6,
      6
    );

    y = processNotices(doc, errors, block.data.data.errors.header, y);
    y = processNotices(doc, warnings, block.data.data.warnings.header, y);
    processNotices(doc, notices, block.data.data.notes.header, y);
  }
  const r: LayoutEvaluationResult<typeof block.data> =
    borderHeight <= block.maxHeight
      ? {
          canFit: true,
          verticalShift: block.yStart + borderHeight,
          data: block.data,
        }
      : { canFit: false, data: block.data };

  return [r];
};

const getLinesHeight = (doc: jsPDF, lines: string[]): number =>
  lines
    .map((line) => doc.getTextDimensions(line).h)
    .reduce((total, current) => total + current, 0);

const getItemLines = (doc: jsPDF, data: string[], innerWidth: number) => {
  if (data.length > 0) {
    return data.flatMap((item) => {
      const dimensions = estimateTextDimensions(doc, item, {
        fontSize: doc.getFontSize(),
      });
      if (dimensions[0] > innerWidth) {
        return doc.splitTextToSize(item, innerWidth);
      }

      return [item];
    });
  }

  return [];
};

const getHeadersHeight = (notices: Notices) => {
  const keys: (keyof Notices)[] = ['errors', 'warnings', 'notes'];
  const headers = keys
    .filter((key) => notices[key].data.length > 0)
    .map((key) => notices[key].header);

  return headers.length * (headingSize + headerSpacing) + headingSize;
};

const setHeaderFontStyle = (doc: jsPDF) => {
  const props = DefaultComponentRenderProps;
  doc.setFont(props.fonts.family, props.fonts.style.bold);
  doc.setFontSize(headingSize);
};

const processNotices = (
  doc: jsPDF,
  notices: string[],
  header: string,
  y: number
): number => {
  const props = DefaultComponentRenderProps;
  const options = RenderNoticesDefaultOptions;
  let yPosition = y;

  if (notices.length > 0) {
    setHeaderFontStyle(doc);
    doc.text(
      header,
      props.dimensions.pageMargin + options.cellPadding.left,
      yPosition
    );
    const headerHeight = doc.getTextDimensions(header).h + headerSpacing;
    yPosition += headerHeight;
    resetFont(doc);

    doc.text(
      notices,
      props.dimensions.pageMargin + options.cellPadding.left,
      yPosition
    );

    yPosition += getLinesHeight(doc, notices) + headerHeight;
  }

  return yPosition + headingSize;
};
