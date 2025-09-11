import { ChipComponent, Colors, Rect } from '@schaeffler/pdf-generator';

import { BadgeStyle } from '@ga/features/grease-calculation/calculation-result/models';

import { BADGE, BadgeBlock, BadgeConfig } from './badge-block';

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
        .mockReturnValue({ fontName: 'Noto', fontStyle: 'normal' }),
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
      text: 'Test Badge',
      style: BadgeStyle.Recommended,
    };

    badgeBlock = new BadgeBlock(defaultConfig);
    badgeBlock.setDocument(mockPdfDoc);

    jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);
    jest
      .spyOn(badgeBlock as any, 'assertDoc')
      .mockImplementation(() => mockPdfDoc.pdfDoc);
  });

  describe('constructor', () => {
    it('should create an instance with the provided config', () => {
      expect(badgeBlock).toBeTruthy();
      expect(badgeBlock['config']).toEqual(defaultConfig);
    });
  });

  describe('evaluate', () => {
    it('should return [true, 4] when text is provided', () => {
      const bounds = new Rect(0, 0, 100, 100);
      const [fits, height] = badgeBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(4);
    });

    it('should return [false, 0] when text is empty', () => {
      const configWithEmptyText = {
        text: '',
      };
      badgeBlock = new BadgeBlock(configWithEmptyText);

      const bounds = new Rect(0, 0, 100, 100);
      const [fits, height] = badgeBlock.evaluate(bounds);

      expect(fits).toBe(false);
      expect(height).toBe(0);
    });

    it('should return [false, 0] when text is undefined', () => {
      const configWithUndefinedText = {
        text: undefined as any,
      };
      badgeBlock = new BadgeBlock(configWithUndefinedText);

      const bounds = new Rect(0, 0, 100, 100);
      const [fits, height] = badgeBlock.evaluate(bounds);

      expect(fits).toBe(false);
      expect(height).toBe(0);
    });
  });

  describe('render', () => {
    it('should not render anything when text is empty', () => {
      const configWithEmptyText = {
        text: '',
      };
      badgeBlock = new BadgeBlock(configWithEmptyText);
      badgeBlock.setDocument(mockPdfDoc);

      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).not.toHaveBeenCalled();
    });

    it('should render badge with recommended style', () => {
      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).toHaveBeenCalledWith({
        chipText: 'Test Badge',
        chipStyle: {
          borderColor: Colors.Success,
          fillColor: Colors.SuccessContainer,
          textColor: Colors.OnSuccessContainer,
        },
        chipTextStyle: {
          fontSize: BADGE.FONT_SIZE,
          fontStyle: 'bold',
          fontFamily: 'Noto',
        },
      });

      const chipInstance = (ChipComponent as jest.Mock).mock.results[0].value;
      expect(chipInstance.setBounds).toHaveBeenCalled();
      expect(chipInstance.setDocument).toHaveBeenCalledWith(mockPdfDoc);
      expect(chipInstance.render).toHaveBeenCalled();
    });

    it('should render badge with success style', () => {
      const configWithSuccessStyle = {
        text: 'Success Badge',
        style: BadgeStyle.Success,
      };
      badgeBlock = new BadgeBlock(configWithSuccessStyle);
      badgeBlock.setDocument(mockPdfDoc);
      jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);
      jest
        .spyOn(badgeBlock as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).toHaveBeenCalledWith({
        chipText: 'Success Badge',
        chipStyle: {
          borderColor: Colors.Surface,
          fillColor: Colors.SuccessContainer,
          textColor: Colors.OnSuccessContainer,
        },
        chipTextStyle: {
          fontSize: BADGE.FONT_SIZE,
          fontStyle: 'bold',
          fontFamily: 'Noto',
        },
      });
    });

    it('should render badge with error style', () => {
      const configWithErrorStyle = {
        text: 'Error Badge',
        style: BadgeStyle.Error,
      };
      badgeBlock = new BadgeBlock(configWithErrorStyle);
      badgeBlock.setDocument(mockPdfDoc);
      jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);
      jest
        .spyOn(badgeBlock as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).toHaveBeenCalledWith({
        chipText: 'Error Badge',
        chipStyle: {
          borderColor: Colors.Surface,
          fillColor: Colors.ErrorContainer,
          textColor: Colors.OnErrorContainer,
        },
        chipTextStyle: {
          fontSize: BADGE.FONT_SIZE,
          fontStyle: 'bold',
          fontFamily: 'Noto',
        },
      });
    });

    it('should render badge with warning style', () => {
      const configWithWarningStyle = {
        text: 'Warning Badge',
        style: BadgeStyle.Warning,
      };
      badgeBlock = new BadgeBlock(configWithWarningStyle);
      badgeBlock.setDocument(mockPdfDoc);
      jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);
      jest
        .spyOn(badgeBlock as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).toHaveBeenCalledWith({
        chipText: 'Warning Badge',
        chipStyle: {
          borderColor: Colors.Surface,
          fillColor: Colors.WarningContainer,
          textColor: Colors.OnWarningContainer,
        },
        chipTextStyle: {
          fontSize: BADGE.FONT_SIZE,
          fontStyle: 'bold',
          fontFamily: 'Noto',
        },
      });
    });

    it('should render badge with miscible style', () => {
      const configWithMiscibleStyle = {
        text: 'Miscible Badge',
        style: BadgeStyle.Miscible,
      };
      badgeBlock = new BadgeBlock(configWithMiscibleStyle);
      badgeBlock.setDocument(mockPdfDoc);
      jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);
      jest
        .spyOn(badgeBlock as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      expect(ChipComponent).toHaveBeenCalledWith({
        chipText: 'Miscible Badge',
        chipStyle: {
          borderColor: Colors.Category2,
          fillColor: Colors.Category2Container,
          textColor: Colors.OnCategory2Container,
        },
        chipTextStyle: {
          fontSize: BADGE.FONT_SIZE,
          fontStyle: 'bold',
          fontFamily: 'Noto',
        },
      });
    });

    it('should use default style when no style is specified', () => {
      const configWithoutStyle = {
        text: 'Default Badge',
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
        chipText: 'Default Badge',
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

    it('should calculate chip width correctly', () => {
      // Ensure the getStringWidth mock is set up correctly for this test
      jest.spyOn(badgeBlock as any, 'getStringWidth').mockReturnValue(40);

      const bounds = new Rect(10, 20, 100, 50);
      badgeBlock.setBounds(bounds);
      badgeBlock.render();

      const chipInstance = (ChipComponent as jest.Mock).mock.results[0].value;
      const setBoundsCall = chipInstance.setBounds.mock.calls[0][0];

      expect(setBoundsCall.x).toBe(bounds.x);
      expect(setBoundsCall.y).toBe(bounds.y);
      expect(setBoundsCall.width).toBe(40 + BADGE.PADDING); // mocked string width + padding
      expect(setBoundsCall.height).toBe(BADGE.HEIGHT);
    });
  });

  describe('getBadgeStyle', () => {
    it('should return success colors for recommended style', () => {
      const style = badgeBlock['getBadgeStyle']();

      expect(style).toEqual({
        borderColor: Colors.Success,
        fillColor: Colors.SuccessContainer,
        textColor: Colors.OnSuccessContainer,
      });
    });

    it('should return success colors for success style', () => {
      const config = {
        text: 'Test Badge',
        style: BadgeStyle.Success,
      };

      badgeBlock = new BadgeBlock(config);

      const style = badgeBlock['getBadgeStyle']();

      expect(style).toEqual({
        borderColor: Colors.Surface,
        fillColor: Colors.SuccessContainer,
        textColor: Colors.OnSuccessContainer,
      });
    });

    it('should return error colors for error style', () => {
      const config = {
        text: 'Test Badge',
        style: BadgeStyle.Error,
      };

      badgeBlock = new BadgeBlock(config);

      const style = badgeBlock['getBadgeStyle']();

      expect(style).toEqual({
        borderColor: Colors.Surface,
        fillColor: Colors.ErrorContainer,
        textColor: Colors.OnErrorContainer,
      });
    });

    it('should return warning colors for warning style', () => {
      const config = {
        text: 'Test Badge',
        style: BadgeStyle.Warning,
      };

      badgeBlock = new BadgeBlock(config);

      const style = badgeBlock['getBadgeStyle']();

      expect(style).toEqual({
        borderColor: Colors.Surface,
        fillColor: Colors.WarningContainer,
        textColor: Colors.OnWarningContainer,
      });
    });

    it('should return category2 colors for miscible style', () => {
      const config = {
        text: 'Test Badge',
        style: BadgeStyle.Miscible,
      };

      badgeBlock = new BadgeBlock(config);

      const style = badgeBlock['getBadgeStyle']();

      expect(style).toEqual({
        borderColor: Colors.Category2,
        fillColor: Colors.Category2Container,
        textColor: Colors.OnCategory2Container,
      });
    });

    it('should return neutral colors for preferred style', () => {
      const config = {
        text: 'Test Badge',
        style: BadgeStyle.Preferred,
      };

      badgeBlock = new BadgeBlock(config);

      const style = badgeBlock['getBadgeStyle']();

      expect(style).toEqual({
        borderColor: Colors.Neutral,
        fillColor: Colors.NeutralContainer,
        textColor: Colors.OnNeutralContainer,
      });
    });

    it('should return default colors for unknown style', () => {
      const config = {
        text: 'Test Badge',
        style: 'unknown' as BadgeStyle,
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
