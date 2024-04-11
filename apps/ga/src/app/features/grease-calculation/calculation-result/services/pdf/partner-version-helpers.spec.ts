/* eslint-disable import/no-extraneous-dependencies */
import jsPDF from 'jspdf';
import { CellHookData } from 'jspdf-autotable';

import { getCellHook } from './partner-version-helpers';

describe('getCellHook', () => {
  it('should add image to the document if cell data matches powerd by row criteria', () => {
    const mockLogo = 'some-image-url';
    const mockDoc = {
      addImage: jest.fn(),
    } as unknown as jsPDF;

    const mockCellData = {
      cursor: { x: 10, y: 10 },
      cell: { contentWidth: 5 },
      column: { index: 0 },
      row: { index: 0, section: 'body' },
    } as unknown as CellHookData;

    const cellHook = getCellHook(mockDoc, mockLogo);

    cellHook(mockCellData);

    expect(mockDoc.addImage).toHaveBeenCalledWith(
      mockLogo,
      'png',
      mockCellData.cursor.x + mockCellData.cell.contentWidth,
      mockCellData.cursor.y + 5,
      70,
      9
    );
  });

  it('should not add image to the document if cell data does not match powered by row criteria', () => {
    const mockDoc = {
      addImage: jest.fn(),
    } as unknown as jsPDF;
    const mockLogo = 'some-image-url';

    const mockCellData = {
      cursor: { x: 10, y: 10 },
      cell: { contentWidth: 5 },
      column: { index: 1 },
      row: { index: 1, section: 'body' },
    } as unknown as CellHookData;

    const cellHook = getCellHook(mockDoc, mockLogo);

    cellHook(mockCellData);

    expect(mockDoc.addImage).not.toHaveBeenCalled();
  });
});
