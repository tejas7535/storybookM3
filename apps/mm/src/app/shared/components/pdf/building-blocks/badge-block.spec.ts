import { ChipComponent, Colors, Rect } from '@schaeffler/pdf-generator';

import { BADGE, BadgeBlock, BadgeConfig, BadgeStyle } from './badge-block';

jest.mock('@schaeffler/pdf-generator', () => {
  const original = jest.requireActual('@schaeffler/pdf-generator');

  return {
    ...original,
    ChipComponent: jest.fn().mockImplementation(() => ({
      setBounds: jest.fn(),
      setDocument: jest.fn(),
      render: jest.fn(),
    })),
  };
});

describe('BadgeBlock', () => {
  let badgeBlock: BadgeBlock;
  let mockPdfDoc: any;
  let defaultConfig: BadgeConfig;

  beforeEach(() => {
    (ChipComponent as jest.Mock).mockClear();

    const mockJsPdf = {
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Arial', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
      getTextDimensions: jest.fn().mockReturnValue({ w: 50, h: 10 }),
      getTextWidth: jest.fn().mockReturnValue(50),
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };

    defaultConfig = {
      textValue: 'Test Badge',
      style: 'recommended',
      position: 'top-right',
    };

    badgeBlock = new BadgeBlock(defaultConfig);
    badgeBlock.setDocument(mockPdfDoc);

    jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);
    jest
      .spyOn(badgeBlock as any, 'assertDoc')
      .mockImplementation(() => mockPdfDoc.pdfDoc);

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with the provided config', () => {
      expect(badgeBlock).toBeTruthy();
      expect(badgeBlock['config']).toEqual(defaultConfig);
    });
  });

  describe('evaluate', () => {
    it('should return [true, 4] when textValue is provided', () => {
      const bounds = new Rect(0, 0, 100, 100);
      const [fits, height] = badgeBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(4);
    });

    it('should return [false, 0] when textValue is empty', () => {
      const configWithEmptyText = {
        textValue: '',
      };
      badgeBlock = new BadgeBlock(configWithEmptyText);

      const bounds = new Rect(0, 0, 100, 100);
      const [fits, height] = badgeBlock.evaluate(bounds);

      expect(fits).toBe(false);
      expect(height).toBe(0);
    });
  });

  describe('render', () => {
    it('should not render anything when textValue is empty', () => {
      const configWithEmptyText = {
        textValue: '',
      };
      badgeBlock = new BadgeBlock(configWithEmptyText);
      badgeBlock.setDocument(mockPdfDoc);

      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).not.toHaveBeenCalled();
    });

    it('should use default style when no style is specified', () => {
      const configWithoutStyle = {
        textValue: 'Test Badge',
      };
      badgeBlock = new BadgeBlock(configWithoutStyle);
      badgeBlock.setDocument(mockPdfDoc);
      jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);
      jest
        .spyOn(badgeBlock as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).toHaveBeenCalledWith({
        chipText: 'Test Badge',
        chipStyle: {
          borderColor: Colors.DarkGreyVariant,
          fillColor: Colors.DarkGreyVariant,
          textColor: Colors.Surface,
        },
        chipTextStyle: {
          fontSize: BADGE.FONT_SIZE,
          fontStyle: 'bold',
          fontFamily: 'Noto',
        },
      });
    });

    it('should use alternative style when specified', () => {
      const configWithAlternativeStyle = {
        textValue: 'Test Badge',
        style: 'alternative' as BadgeStyle,
      };
      badgeBlock = new BadgeBlock(configWithAlternativeStyle);
      badgeBlock.setDocument(mockPdfDoc);
      jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);
      jest
        .spyOn(badgeBlock as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).toHaveBeenCalledWith({
        chipText: 'Test Badge',
        chipStyle: {
          borderColor: Colors.DarkGreyVariant,
          fillColor: Colors.DarkGreyVariant,
          textColor: Colors.Surface,
        },
        chipTextStyle: {
          fontSize: BADGE.FONT_SIZE,
          fontStyle: 'bold',
          fontFamily: 'Noto',
        },
      });
    });
  });

  describe('getBadgeStyle', () => {
    it('should return primary colors for recommended style', () => {
      const style = badgeBlock['getBadgeStyle']();

      expect(style).toEqual({
        borderColor: Colors.Primary,
        fillColor: Colors.Primary,
        textColor: Colors.Surface,
      });
    });

    it('should return dark grey colors for other styles', () => {
      const config = {
        textValue: 'Test Badge',
        style: 'alternative' as BadgeStyle,
      };

      badgeBlock = new BadgeBlock(config);

      const style = badgeBlock['getBadgeStyle']();

      expect(style).toEqual({
        borderColor: Colors.DarkGreyVariant,
        fillColor: Colors.DarkGreyVariant,
        textColor: Colors.Surface,
      });
    });
  });
});
