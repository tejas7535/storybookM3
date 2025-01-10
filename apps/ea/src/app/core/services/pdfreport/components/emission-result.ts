/* eslint-disable complexity */
/* eslint-disable max-lines */
import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import jsPDF from 'jspdf';

import {
  ComingSoonSection,
  DefaultComponentRenderProps,
  DefaultDocumentColors,
  DownstreamError,
  Emissions,
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

const emmisionResultSpacing = {
  blockMargin: 12,
  smallBlockMargin: 6,
  spaceBetweenItems: 40,
};

function willContentFit(height: number, maxHeight: number): boolean {
  const bottomHeightOffset = 20;
  const minimumHeight = height + bottomHeightOffset;

  return minimumHeight <= maxHeight;
}

function renderMultipleLineText(
  multiLineText: string[],
  doc: jsPDF,
  xPosition: number,
  yPosition: number,
  isDryRun: boolean
): { h: number; itemsHeight: number } {
  let itemYPos = yPosition;
  const itemXPos = xPosition;
  let itemsHeight = 0;

  for (const [_index, text] of multiLineText.entries()) {
    const [_width, textHeight] = estimateTextDimensions(doc, `${text}`, {
      fontSize: doc.getFontSize(),
    });

    if (!isDryRun) {
      doc.text(text, itemXPos, itemYPos);
    }

    itemsHeight += textHeight;
    itemYPos += textHeight + 4;
  }

  return { h: itemYPos, itemsHeight };
}

function renderError(
  error: DownstreamError,
  doc: jsPDF,
  xPosition: number,
  yPosition: number,
  isDryRun: boolean
): { h: number; itemsHeight: number } {
  let itemYPos = yPosition;
  const itemXPos = xPosition;
  let itemsHeight = 0;
  const currentColor = doc.getTextColor();
  doc.setTextColor(DefaultDocumentColors.mediumEmphasisTextColor);
  doc.setFontSize(12);
  itemYPos += emmisionResultSpacing.smallBlockMargin;

  const titleLines: string[] = doc.splitTextToSize(error.title, 350);

  const titleResult = renderMultipleLineText(
    titleLines,
    doc,
    itemXPos,
    itemYPos,
    isDryRun
  );

  itemYPos = titleResult.h;
  itemsHeight += titleResult.itemsHeight;
  resetFont(doc);

  doc.setTextColor(DefaultDocumentColors.onErrorContainerColor);

  const errorLines: string[] = doc.splitTextToSize(error.error, 350);
  const errorResult = renderMultipleLineText(
    errorLines,
    doc,
    itemXPos,
    itemYPos,
    isDryRun
  );

  itemYPos = errorResult.h;
  itemsHeight += errorResult.itemsHeight;

  doc.setTextColor(currentColor);

  return { h: itemYPos, itemsHeight };
}

function renderCommingSoonSection(
  section: ComingSoonSection,
  doc: jsPDF,
  xPosition: number,
  yPosition: number,
  isDryRun: boolean
): { h: number; itemsHeight: number } {
  let itemYPos = yPosition;
  const itemXPos = xPosition;
  let itemsHeight = 0;

  const bearingTitleHeight = renderChip(
    doc,
    section.bearingTitle,
    itemXPos,
    itemYPos,
    {
      background: DefaultDocumentColors.mainGreenColor,
      text: DefaultDocumentColors.darkGreenColor,
    },
    isDryRun
  );

  itemsHeight += bearingTitleHeight;
  itemYPos += bearingTitleHeight + emmisionResultSpacing.blockMargin * 2;

  doc.setFontSize(13);

  const [_titleWidth, _titleHeight] = estimateTextDimensions(
    doc,
    `${section.title}`,
    { fontSize: doc.getFontSize() }
  );

  if (!isDryRun) {
    doc.text(section.title, itemXPos, itemYPos);
  }

  resetFont(doc);

  itemsHeight += _titleHeight;
  itemYPos += _titleHeight + 6;

  const description: string[] = doc.splitTextToSize(section.description, 300);
  const color = doc.getTextColor();
  doc.setTextColor(DefaultDocumentColors.mediumEmphasisTextColor);

  const descriptionResult = renderMultipleLineText(
    description,
    doc,
    itemXPos,
    itemYPos,
    isDryRun
  );

  itemYPos = descriptionResult.h;
  itemsHeight += descriptionResult.itemsHeight;

  doc.setTextColor(color);

  return { h: itemYPos, itemsHeight };
}

function renderResultReportLargeItem(
  item: ResultReportLargeItem,
  doc: jsPDF,
  index: number,
  xPosition: number,
  yPosition: number,
  isDryRun: boolean,
  containsMultipleItems: boolean = false,
  isLoadcase: boolean = false,
  warningTop: boolean = false
): { w: number; h: number; itemsHeight: number; startYPosition: number } {
  let itemYPos = yPosition;
  let startYPosition = yPosition;
  let itemXPos = xPosition;
  let itemsHeight = 0;

  const valSeparator = 4;
  const isFirst = index === 0;

  const indicatorXOffset = 10;

  if (item.warning && warningTop) {
    doc.setFontSize(10);
    const color = doc.getTextColor();
    doc.setTextColor(DefaultDocumentColors.lowEmphasisTextColor);

    const lines: string[] = doc.splitTextToSize(item.warning, 400);
    const disclaimerResult = renderMultipleLineText(
      lines,
      doc,
      itemXPos + indicatorXOffset,
      itemYPos,
      isDryRun
    );

    itemYPos = disclaimerResult.h + emmisionResultSpacing.smallBlockMargin;
    itemsHeight +=
      disclaimerResult.itemsHeight + emmisionResultSpacing.smallBlockMargin;

    doc.setTextColor(color);

    startYPosition =
      disclaimerResult.h + emmisionResultSpacing.smallBlockMargin;
    resetFont(doc);
  }
  const titleFontSize = containsMultipleItems ? 10 : 12;
  doc.setFontSize(titleFontSize);
  const [_itemTitleWidth, itemTitleHeight] = estimateTextDimensions(
    doc,
    `${item.title}`,
    { fontSize: doc.getFontSize() }
  );

  if (isFirst && !isDryRun) {
    if (item.titleTooltip) {
      const circleXPos = itemXPos;
      const circleYPos = itemYPos - 4;
      const circleRadius = 5;
      doc.setFillColor(item.titleTooltip);
      doc.circle(circleXPos, circleYPos, circleRadius, 'F');
    }

    itemXPos += indicatorXOffset;

    const color = doc.getTextColor();
    doc.setTextColor(DefaultDocumentColors.mediumEmphasisTextColor);
    doc.text(item.title, itemXPos, itemYPos);
    doc.setTextColor(color);
  }

  itemsHeight += itemTitleHeight;

  resetFont(doc);

  const itemFontSize = isLoadcase ? 10 : 14;
  const spacingBelowTitle = isLoadcase
    ? emmisionResultSpacing.smallBlockMargin
    : emmisionResultSpacing.blockMargin;

  doc.setFontSize(itemFontSize);

  const [itemValueWidth, itemValueHeight] = estimateTextDimensions(
    doc,
    `${item.value}`,
    { fontSize: doc.getFontSize() }
  );

  itemYPos += itemTitleHeight + spacingBelowTitle;
  itemsHeight += itemValueHeight;

  if (!isDryRun) {
    doc.text(item.value.toString(), itemXPos, itemYPos);
  }

  resetFont(doc);

  const [itemUnitWidth, _itemUnitHeight] = estimateTextDimensions(
    doc,
    `${item.unit}`,
    { fontSize: doc.getFontSize() }
  );

  const unitXPos = itemXPos + itemValueWidth + valSeparator;

  if (!isDryRun) {
    doc.text(item.unit, unitXPos, itemYPos);
  }

  const spacingBelowValue = containsMultipleItems
    ? emmisionResultSpacing.smallBlockMargin
    : emmisionResultSpacing.blockMargin;

  itemYPos += itemValueHeight + spacingBelowValue;
  if (!isDryRun) {
    const color = doc.getTextColor();
    doc.setTextColor(DefaultDocumentColors.lowEmphasisTextColor);
    doc.text(item.short, itemXPos, itemYPos);
    doc.setTextColor(color);
  }

  const [itemShortWidth, itemShortHeight] = estimateTextDimensions(
    doc,
    `${item.short}`,
    { fontSize: doc.getFontSize() }
  );

  itemsHeight += itemShortHeight;
  itemYPos += itemShortHeight;

  if (item.warning && !warningTop) {
    itemYPos += emmisionResultSpacing.blockMargin;
    const color = doc.getTextColor();
    doc.setTextColor(DefaultDocumentColors.lowEmphasisTextColor);

    const lines: string[] = doc.splitTextToSize(item.warning, 400);
    const disclaimerResult = renderMultipleLineText(
      lines,
      doc,
      itemXPos,
      itemYPos,
      isDryRun
    );

    itemYPos = disclaimerResult.h;
    itemsHeight +=
      disclaimerResult.itemsHeight + emmisionResultSpacing.blockMargin;

    doc.setTextColor(color);
  }

  const comibnedValueWithUnitWidth =
    itemValueWidth + valSeparator + itemUnitWidth;

  const maxWidthPosition = Math.max(comibnedValueWithUnitWidth, itemShortWidth);

  itemXPos += maxWidthPosition + emmisionResultSpacing.spaceBetweenItems;

  return {
    w: itemXPos,
    h: itemYPos,
    itemsHeight,
    startYPosition,
  };
}

function renderChartImage(
  doc: jsPDF,
  block: LayoutBlock<ResultBlock<Emissions>>,
  xPos: number,
  yPos: number
) {
  const chart = block?.data?.data.chart;
  if (chart?.value) {
    doc.text(chart.title, xPos + 50, yPos, { align: 'center' });

    doc.addImage(chart.value, 'png', xPos + 15, yPos + 5, 80, 80);
  }
}

export const renderEmissions = (
  doc: jsPDF,
  block: LayoutBlock<ResultBlock<Emissions>>
): LayoutEvaluationResult<ResultBlock<Emissions>>[] => {
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
  const isDryRun = block.dryRun;

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
    resetFont(doc);
  }

  let bodyHeight = options.cellPadding.top + options.cellPadding.bottom;

  bodyHeight += 4 * blockMargin;

  const chartOffset = 100;

  const chartXPos = startX + options.headerSpacing.left;

  const upstreamYPositions = [];
  const itemsHeights = [];
  const canvasX = startX + options.cellPadding.left + chartOffset;
  let upstreamXPos = canvasX;

  const upstreamEmissions = block.data.data?.upstreamEmission;
  const downstreamEmission = block.data.data?.downstreamEmissions;

  const hasMultipleLoadcases = downstreamEmission?.loadcases?.length > 0;
  let printY = upstreamEmissions ? headerDivierY + 15 : headerDivierY;
  let contentHeight = upstreamEmissions
    ? bodyHeight + headerHeight
    : headerHeight;
  if (upstreamEmissions) {
    contentHeight += 15;
    if (!isDryRun) {
      renderChartImage(doc, block, chartXPos, printY);
    }

    for (const [index, item] of upstreamEmissions.entries()) {
      const { w, h, itemsHeight } = renderResultReportLargeItem(
        item,
        doc,
        index,
        upstreamXPos,
        printY,
        isDryRun,
        hasMultipleLoadcases
      );

      upstreamXPos = w;
      upstreamYPositions.push(h);
      itemsHeights.push(itemsHeight);
    }
    printY = Math.max(...upstreamYPositions);

    contentHeight += Math.max(...itemsHeights);

    if (!isDryRun) {
      doc.line(canvasX, printY, width, printY);
    }

    printY += options.divierSpacing.top;

    contentHeight += options.divierSpacing.top;
  }

  const totalDownstreamEmission = downstreamEmission.totalEmission;

  if (totalDownstreamEmission) {
    let itemXPos = canvasX;
    let itemYPos = printY + emmisionResultSpacing.smallBlockMargin;
    contentHeight += emmisionResultSpacing.smallBlockMargin;

    const itemsYPositions = [];
    const totalItemHeights = [];
    const isLoadcaseItem = false;
    for (const [index, item] of totalDownstreamEmission.entries()) {
      const { w, h, itemsHeight, startYPosition } = renderResultReportLargeItem(
        item,
        doc,
        index,
        itemXPos,
        itemYPos,
        isDryRun,
        hasMultipleLoadcases,
        isLoadcaseItem,
        true
      );

      itemXPos = w;

      itemYPos = startYPosition;
      itemsYPositions.push(h);
      totalItemHeights.push(itemsHeight);
    }

    printY = Math.max(...itemsYPositions);
    contentHeight += Math.max(...totalItemHeights);
  }

  const commingSoonSection =
    block.data.data?.downstreamEmissions.commingSoonSection;

  if (commingSoonSection) {
    const itemXPos = canvasX;
    const itemYPos = printY;

    const { h, itemsHeight } = renderCommingSoonSection(
      commingSoonSection,
      doc,
      itemXPos,
      itemYPos,
      isDryRun
    );

    printY = h;
    contentHeight += itemsHeight;
  }

  const error = block.data.data?.downstreamEmissions.error;

  if (error) {
    const itemXPos = canvasX;
    const itemYPos = printY;

    const { h, itemsHeight } = renderError(
      error,
      doc,
      itemXPos,
      itemYPos,
      isDryRun
    );

    printY = h;
    contentHeight += itemsHeight;
  }

  // check if upstream, chart and total section will at least as one block, otherwise change page
  if (!willContentFit(contentHeight, block.maxHeight) && isDryRun) {
    return [
      {
        canFit: false,
        data: block.data,
      },
    ];
  }

  const loadcases = block.data.data?.downstreamEmissions.loadcases;

  let loadcaseYPos = printY;
  const successfulFits: Emissions = {
    upstreamEmission: block.data.data.upstreamEmission,
    chart: block.data.data.chart,
    downstreamEmissions: {
      totalEmission: block.data.data.downstreamEmissions.totalEmission,
      commingSoonSection:
        block.data.data.downstreamEmissions.commingSoonSection,
      error: block.data.data.downstreamEmissions.error,
      loadcases: [],
    },
  };

  const nonFittingItems: Emissions = {
    upstreamEmission: undefined,
    chart: block.data.data.chart,
    downstreamEmissions: {
      totalEmission: undefined,
      commingSoonSection: undefined,
      error: undefined,
      loadcases: [],
    },
  };

  let nonFittingHeights = 0;
  const minimumNumberOfLoadcasesInOneBlock = 4;
  for (const [_loadcaseIndex, loadcase] of loadcases.entries()) {
    let loadcaseXPos = canvasX;
    const firstLoadcaseOnlyItem =
      _loadcaseIndex === 0 && !totalDownstreamEmission;

    if (!isDryRun && !firstLoadcaseOnlyItem) {
      doc.line(canvasX, loadcaseYPos, width, loadcaseYPos);
    }

    loadcaseYPos += 2 * options.divierSpacing.top;
    contentHeight += 2 * options.divierSpacing.top;

    contentHeight += 10;

    const loadcaseYPositions = [];
    const loadcasesHeight = [];

    const isLoadcase = true;

    for (const [index, item] of loadcase.items.entries()) {
      const { w, h, itemsHeight } = renderResultReportLargeItem(
        item,
        doc,
        index,
        loadcaseXPos,
        loadcaseYPos,
        isDryRun,
        hasMultipleLoadcases,
        isLoadcase
      );

      loadcaseXPos = w;
      loadcaseYPositions.push(h);
      loadcasesHeight.push(itemsHeight);
    }

    loadcaseYPos = Math.max(...loadcaseYPositions);
    contentHeight += Math.max(...loadcasesHeight);

    // check if minimum number of loadcases can fit into single page block
    if (
      downstreamEmission.totalEmission &&
      _loadcaseIndex < minimumNumberOfLoadcasesInOneBlock &&
      !willContentFit(contentHeight, block.maxHeight) &&
      isDryRun
    ) {
      return [
        {
          canFit: false,
          data: block.data,
        },
      ];
    }

    if (!willContentFit(contentHeight, block.maxHeight) && isDryRun) {
      nonFittingItems.downstreamEmissions.loadcases.push(loadcase);
      nonFittingHeights = +nonFittingHeights;
    } else {
      successfulFits.downstreamEmissions.loadcases.push(loadcase);
    }
  }

  printY = loadcaseYPos;

  if (!isDryRun) {
    const lineYStart = y + headerHeight;
    const lineXPos = canvasX - 10;
    const lineYEnd = contentHeight + y;

    doc.setDrawColor(style.colors.tableBorderTextColor);
    doc.line(lineXPos, lineYStart, lineXPos, lineYEnd);
    doc.roundedRect(startX, y, width, contentHeight, 6, 6, 'S');
  }

  const offSetMagicNumber = 30;
  const ret: LayoutEvaluationResult<typeof block.data>[] = [
    {
      canFit: true,
      verticalShift:
        block.yStart + headerHeight + contentHeight - offSetMagicNumber,
      data: {
        ...block.data,
        data: successfulFits,
      },
    },
  ];

  if (nonFittingItems.downstreamEmissions.loadcases.length > 0) {
    ret.push({
      canFit: false,
      data: {
        ...block.data,
        data: nonFittingItems,
      },
    });
  }

  return ret;
};
