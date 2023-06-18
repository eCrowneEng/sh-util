type SizeSpec = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  xOffset?: number;
  yOffset?: number;
};
type FontSpec = { fontFamily: string; sizes: { [key: string]: SizeSpec } };

export const colors = ['#000', '#fff', '#000'];

export const wrapStrategies = ['none', 'word', 'none'];

export const shFontStyles: { [key: string]: FontSpec } = {
  type0: {
    // this is not perfect, but good enough
    fontFamily: 'Apple II',
    sizes: {
      1: {
        fontSize: 8,
        letterSpacing: -1,
        lineHeight: 1,
        xOffset: 1,
        yOffset: 0,
      },
      2: {
        fontSize: 16,
        letterSpacing: -2,
        lineHeight: 1,
        xOffset: 2,
        yOffset: 0,
      },
      3: {
        fontSize: 24,
        letterSpacing: -5,
        lineHeight: 1,
        xOffset: 3,
        yOffset: 0,
      },
      4: {
        fontSize: 32,
        letterSpacing: -7,
        lineHeight: 1,
        xOffset: 4,
        yOffset: 0,
      },
      5: {
        fontSize: 40,
        letterSpacing: -8,
        lineHeight: 1,
        xOffset: 5,
        yOffset: 0,
      },
    },
  },
  type1: {
    fontFamily: 'Open 24 ST',
    sizes: {
      1: {
        fontSize: 23,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -23,
      },
      2: {
        fontSize: 46,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -46,
      },
      3: {
        fontSize: 69,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -69,
      },
      4: {
        fontSize: 96,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -93,
      },
      5: {
        fontSize: 115,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -115,
      },
    },
  },
  type2: {
    // same font as type 2 but larger..
    fontFamily: 'Open 24 ST',
    sizes: {
      1: {
        fontSize: 36,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -35,
      },
      2: {
        fontSize: 72,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -70,
      },
      3: {
        fontSize: 108,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -105,
      },
      4: {
        fontSize: 148,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -141,
      },
      5: {
        fontSize: 180,
        letterSpacing: 0,
        lineHeight: 1,
        xOffset: 0,
        yOffset: -174,
      },
    },
  },
};
