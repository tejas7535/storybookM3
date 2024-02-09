import { WarningIcon } from '@ea/shared/constants/pdf-icons';
import jsPDF from 'jspdf'; // eslint-disable-line import/no-extraneous-dependencies

import {
  DefaultComponentRenderProps,
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

export const renderNotices = (
  doc: jsPDF,
  block: LayoutBlock<ResultBlock<string[]>>
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

  const notices = block.data.data;
  const lines = notices.flatMap((item) => {
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
    block.yStart +
    2 * options.cellPadding.top +
    totalHeight +
    options.cellPadding.bottom;
  if (!block.dryRun) {
    doc.roundedRect(
      props.dimensions.pageMargin,
      block.yStart,
      width,
      borderHeight,
      6,
      6
    );
    doc.text(lines, props.dimensions.pageMargin + options.cellPadding.left, y);
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
