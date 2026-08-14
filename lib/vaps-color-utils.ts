export function readableAccentColor(hex: string) {
  const rgb = parseHex(hex);
  if (!rgb) return hex;

  const luminance = relativeLuminance(rgb);
  if (luminance > 0.52) return mix(rgb, { r: 24, g: 36, b: 52 }, 0.46);
  return hex;
}

export function surfaceAccentColor(hex: string) {
  const rgb = parseHex(hex);
  if (!rgb) return hex;

  const luminance = relativeLuminance(rgb);
  if (luminance > 0.66) return mix(rgb, { r: 24, g: 36, b: 52 }, 0.2);
  return hex;
}

function parseHex(hex: string) {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  const value = Number.parseInt(normalized, 16);
  return {
    b: value & 255,
    g: (value >> 8) & 255,
    r: (value >> 16) & 255,
  };
}

function relativeLuminance({ b, g, r }: { b: number; g: number; r: number }) {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function mix(from: { b: number; g: number; r: number }, to: { b: number; g: number; r: number }, amount: number) {
  const channel = (start: number, end: number) => Math.round(start + (end - start) * amount);
  return `rgb(${channel(from.r, to.r)}, ${channel(from.g, to.g)}, ${channel(from.b, to.b)})`;
}
