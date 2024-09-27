/* eslint-disable import/no-extraneous-dependencies */
import jsPDF from 'jspdf';
import { CellHookData } from 'jspdf-autotable';

const RECOMMENDED_H_PADDING = 3;
const RECOMMENDED_BORDER_RADIUS = 3;
const RECOMMENDED_V_PADDING = 3;

export const getCellHook =
  (
    doc: jsPDF,
    logo?: string,
    recommended?: boolean,
    recommendedText?: string
  ) =>
  (cellData: CellHookData) => {
    if (!!isPoweredByResultDataRow(cellData) && !!logo) {
      const width = 70;
      const height = 9;
      const x = cellData.cursor.x + cellData.cell.contentWidth;
      const y = cellData.cursor.y + 5;
      doc.addImage(logo, 'png', x, y, width, height);
    }

    if (
      recommended &&
      !!recommendedText &&
      shouldAddRecommendedBadge(cellData)
    ) {
      const { w, h } = doc.getTextDimensions(recommendedText);
      const colWidth = cellData.table.columns
        .map((col) => col.width)
        .reduce((prev, curr) => prev + curr, 0);

      const yStart = cellData.cursor.y + RECOMMENDED_V_PADDING;
      const xStart =
        cellData.cursor.x + colWidth - w - 3 * RECOMMENDED_H_PADDING;
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(0, 137, 61);
      doc.roundedRect(
        xStart,
        yStart,
        w + 2 * RECOMMENDED_H_PADDING,
        h + 2 * RECOMMENDED_V_PADDING,
        RECOMMENDED_BORDER_RADIUS,
        RECOMMENDED_BORDER_RADIUS,
        'F'
      );

      doc.text(
        recommendedText,
        xStart + RECOMMENDED_H_PADDING,
        yStart + RECOMMENDED_V_PADDING,
        { baseline: 'top' }
      );
    }
  };

function isPoweredByResultDataRow(cellData: CellHookData): boolean {
  return (
    cellData.column.index === 0 &&
    cellData.row.index === 0 &&
    cellData.row.section === 'body'
  );
}

function shouldAddRecommendedBadge(cellData: CellHookData) {
  return (
    cellData.section === 'head' &&
    cellData.cell.colSpan === 2 &&
    cellData.cell.text.some((cellText) => cellText.includes('Arcanol'))
  );
}
