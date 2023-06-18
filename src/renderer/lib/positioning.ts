/**
 * Calculates parameters for vertical positioning
 */
export function withVerticalAlignStrategy(
  ySpec: number,
  yOffset: number,
  currentHeight: number
): object {
  const actualHeight = currentHeight > 0 ? currentHeight : undefined;
  const none = { y: -1000 };
  if (!actualHeight) {
    return none;
  }
  return {
    height: actualHeight,
    y: ySpec + yOffset,
    align: 'bottom',
  };
}

/**
 * Calculates parameters for vertical positioning
 */
export function withHorizontalAlignStrategy(
  type: number,
  xSpec: number,
  xOffset: number,
  currentWidth: number
): object {
  const actualWidth = currentWidth > 0 ? currentWidth : undefined;
  const none = { x: -1000 };
  if (!actualWidth) {
    return none;
  }
  switch (type) {
    case 1: // left
      return { x: xSpec - xOffset, align: 'left' };
    case 2: // center
      return { x: xSpec - xOffset / 2, align: 'center' };
    case 3: // right
      return {
        width: actualWidth,
        x: xSpec + xOffset - (actualWidth ?? 0),
        align: 'right',
      };
    default:
      return none;
  }
}
