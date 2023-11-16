import { CalculationResultReportMessage } from '@ea/core/store/models/calculation-result-report-message.model';
import { WarningIcon } from '@ea/shared/constants/pdf-icons';
import jsPDF from 'jspdf';

import {
  DefaultComponentRenderProps,
  DocumentData,
  ResultTableAttributes,
} from '../data';
import { estimateTextDimensions, getRealLineHeight, resetFont } from '../util';

const RenderNoticesDefaultOptions: ResultTableAttributes = {
  headerSpacing: { top: 8, bottom: 8, left: 8, right: 8 },
  cellPadding: { top: 18, bottom: 18, left: 36, right: 36 },
  borderColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierColor: DefaultComponentRenderProps.colors.tableBorderTextColor,
  divierSpacing: { left: 9, right: 9, top: 10, bottom: 10 },
};

export const renderNotices = (
  doc: jsPDF,
  notices: CalculationResultReportMessage[],
  startY: number,
  dryRun: boolean = false,
  docSettings: DocumentData,
  props = DefaultComponentRenderProps,
  options = RenderNoticesDefaultOptions
): number => {
  const width =
    doc.internal.pageSize.getWidth() - 2 * props.dimensions.pageMargin;
  const innerWidth =
    width - options.cellPadding.left - options.cellPadding.right;
  const imageSize = 16;
  const headerDivierY =
    startY +
    imageSize +
    options.headerSpacing.top +
    options.headerSpacing.bottom;
  let y = startY;

  if (!dryRun) {
    doc.setFont(props.fonts.family, props.fonts.style.bold);
    doc.setFontSize(10);
    doc.addImage(
      WarningIcon,
      'png',
      props.dimensions.pageMargin + options.headerSpacing.left,
      startY + options.headerSpacing.top,
      imageSize,
      imageSize
    );
    doc.text(
      docSettings.noticeHeading,
      props.dimensions.pageMargin + imageSize + 8 + options.headerSpacing.left,
      startY + 1.5 * getRealLineHeight(doc) + imageSize / 2
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

  const flattenNotices = (
    toFlatten: CalculationResultReportMessage[]
  ): string[] => {
    let result: string[] = [];
    toFlatten.forEach((notice) => {
      if (notice.item) {
        if (notice.item.messages) {
          result = [...result, ...notice.item.messages];
        }
        if (notice.item.subItems) {
          result = flattenNotices(notice.item.subItems);
        }
      }
    });

    return result;
  };

  const flattened = flattenNotices(notices);
  const lines = flattened.flatMap((item) => {
    const dimensions = estimateTextDimensions(doc, item, {
      fontSize: doc.getFontSize(),
    });
    if (dimensions[0] > innerWidth) {
      return doc.splitTextToSize(item, innerWidth);
    }

    return [item];
  });

  const totalHeight = lines
    .map((l) => doc.getTextDimensions(l).h)
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((acc, curr) => {
      const ret = acc + curr;

      return ret;
    }, 0);

  const borderHeight =
    headerDivierY -
    startY +
    2 * options.cellPadding.top +
    totalHeight +
    options.cellPadding.bottom;
  if (!dryRun) {
    doc.roundedRect(
      props.dimensions.pageMargin,
      startY,
      width,
      borderHeight,
      6,
      6
    );
    doc.text(lines, props.dimensions.pageMargin + options.cellPadding.left, y);
  }

  return borderHeight;
};
