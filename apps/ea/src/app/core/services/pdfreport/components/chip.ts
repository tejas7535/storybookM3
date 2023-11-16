import jsPDF from 'jspdf';

import { DefaultComponentRenderProps, Spacing } from '../data';
import { getRealLineHeight, resetFont } from '../util';

export const renderChip = (
  doc: jsPDF,
  text: string,
  startX: number,
  startY: number,
  colors: { background: string; text: string },
  props = DefaultComponentRenderProps,
  spacing = { left: 9, right: 9, top: 8, bottom: 9 } as Spacing
) => {
  resetFont(doc);
  doc.setFontSize(7);
  doc.setFont(props.fonts.family, props.fonts.style.bold);
  doc.setTextColor(colors.text);
  const chipHeight = spacing.top + spacing.bottom + getRealLineHeight(doc);
  const chipWidth =
    spacing.left +
    spacing.right +
    doc.getStringUnitWidth(text) * doc.getFontSize();

  doc.setDrawColor(colors.text);
  doc.setFillColor(colors.background);
  doc.roundedRect(
    startX,
    startY,
    chipWidth,
    chipHeight,
    chipHeight / 2,
    chipHeight / 2,
    'FD'
  );
  doc.text(
    text,
    startX + spacing.left,
    startY + getRealLineHeight(doc) + spacing.top
  );
  resetFont(doc);
  doc.setTextColor(props.colors.secondaryTextColor);

  return chipHeight;
};
