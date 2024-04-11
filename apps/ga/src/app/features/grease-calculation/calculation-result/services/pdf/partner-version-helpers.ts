/* eslint-disable import/no-extraneous-dependencies */
import jsPDF from 'jspdf';
import { CellHookData } from 'jspdf-autotable';

export const getCellHook =
  (doc: jsPDF, logo: string) => (cellData: CellHookData) => {
    if (isPoweredByResultDataRow(cellData)) {
      const width = 70;
      const height = 9;
      const x = cellData.cursor.x + cellData.cell.contentWidth;
      const y = cellData.cursor.y + 5;
      doc.addImage(logo, 'png', x, y, width, height);
    }
  };

function isPoweredByResultDataRow(cellData: CellHookData): boolean {
  return (
    cellData.column.index === 0 &&
    cellData.row.index === 0 &&
    cellData.row.section === 'body'
  );
}
