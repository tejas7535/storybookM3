import { Colors } from '../../constants/colors.enum';
import { FontOptions } from '../../core';

export interface ChipComponentData {
  chipText: string;
  chipStyle?: ChipStyle;
  chipTextStyle?: FontOptions;
  icon?: string;
}

export interface ChipStyle {
  borderColor: Colors;
  fillColor: Colors;
  textColor: Colors;
}
