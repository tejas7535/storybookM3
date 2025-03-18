export function toHex(color: string): string {
  if (color.startsWith('rgba')) {
    return rgbaToHex(color);
  } else if (color.startsWith('rgb')) {
    return rgbToHex(color);
  } else if (color.startsWith('#')) {
    return color;
  }

  return color;
}

function rgbToHex(rgb: string): string {
  const result = rgb.match(/\d+/g);
  if (result) {
    const r = Number.parseInt(result[0], 10);
    const g = Number.parseInt(result[1], 10);
    const b = Number.parseInt(result[2], 10);

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  }

  return rgb;
}

function rgbaToHex(rgba: string): string {
  const result = rgba.match(/\d+/g);
  if (result) {
    const r = Number.parseInt(result[0], 10);
    const g = Number.parseInt(result[1], 10);
    const b = Number.parseInt(result[2], 10);
    const a = Number.parseFloat(result[3]);
    const alpha = Math.round(a * 255);

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}${componentToHex(alpha)}`;
  }

  return rgba;
}

function componentToHex(c: number): string {
  const hex = c.toString(16);

  return hex.length === 1 ? `0${hex}` : hex;
}
