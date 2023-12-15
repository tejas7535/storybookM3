import jsPDF from 'jspdf';

import { DefaultComponentRenderProps } from './data';

export const getRealLineHeight = (doc: jsPDF): number =>
  doc.getFontSize() / doc.getLineHeightFactor();

export const resetFont = (doc: jsPDF, props = DefaultComponentRenderProps) => {
  doc.setFont(props.fonts.family, props.fonts.style.normal);
  doc.setFontSize(props.dimensions.textFontSize);
};
export const getRealPageWidth = (
  doc: jsPDF,
  props = DefaultComponentRenderProps
) => doc.internal.pageSize.getWidth() - 2 * props.dimensions.pageMargin;

export const getStringContentWidth = (doc: jsPDF, content: string) =>
  doc.getStringUnitWidth(content) * doc.getFontSize();

export const resetFontStyle = (
  doc: jsPDF,
  props = DefaultComponentRenderProps
) => doc.setFont(props.fonts.family, props.fonts.style.normal);

const textDimensionsDefaultOptions: Partial<{
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
}> = {
  fontFamily: DefaultComponentRenderProps.fonts.family,
  fontStyle: DefaultComponentRenderProps.fonts.style.normal,
};

export const estimateTextDimensions = (
  doc: jsPDF,
  text: string,
  option: Partial<{
    fontSize: number;
    fontFamily: string;
    fontStyle: string;
  }> = textDimensionsDefaultOptions
): [number, number] => {
  const oldFontSize = doc.getFontSize();
  const oldFont = doc.getFont();

  doc.setFontSize(option.fontSize);
  doc.setFont(option.fontFamily, option.fontStyle);
  const width = getStringContentWidth(doc, text);
  const height = getRealLineHeight(doc);

  doc.setFont(oldFont.fontName, oldFont.fontStyle);
  doc.setFontSize(oldFontSize);

  return [width, height];
};
