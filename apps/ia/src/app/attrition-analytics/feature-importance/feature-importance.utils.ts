import { Color } from '../../shared/models/color.enum';

export const calculateColor = (weight: number): string => {
  if (weight === undefined || weight <= 0) {
    return Color.DARK_GREY;
  }
  if (weight >= 1) {
    return Color.RED_RGB;
  }
  // from blue, via purple, to red
  const gradient = [
    [0, [3, 147, 240]],
    [50, [177, 49, 172]],
    [100, [251, 36, 36]],
  ];
  const percent = weight * 100;

  const colorRange: number[] = getColorRangeFromGradient(percent, gradient);

  // Get the two closest colors
  const firstcolor = gradient[colorRange[0]][1] as number[];
  const secondcolor = gradient[colorRange[1]][1] as number[];

  // Calculate ratio between the two closest colors
  const firstcolor_x = +gradient[colorRange[0]][0] / 100;
  const secondcolor_x = +gradient[colorRange[1]][0] / 100 - firstcolor_x;
  const slider_x = percent / 100 - firstcolor_x;
  const ratio = slider_x / secondcolor_x;

  const hex = pickHex(secondcolor, firstcolor, ratio);

  return `rgb(${hex[0]}, ${hex[1]}, ${hex[2]})`;
};

// from less.js's mix function
export const pickHex = (
  color1: number[],
  color2: number[],
  weight: number
): number[] => {
  const p = weight;
  const w = p * 2 - 1;
  const w1 = (w / 1 + 1) / 2;
  const w2 = 1 - w1;
  const rgb = [
    Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2),
  ];

  return rgb;
};

export const getColorRangeFromGradient = (
  percent: number,
  gradient: (number | number[])[][]
): number[] => {
  let colorRange: number[];

  let index = 0;
  while (!colorRange) {
    if (percent <= gradient[index][0]) {
      colorRange = [index - 1, index];
    }
    if (index === gradient.length) {
      colorRange = [];
    }

    index += 1;
  }

  return colorRange;
};
