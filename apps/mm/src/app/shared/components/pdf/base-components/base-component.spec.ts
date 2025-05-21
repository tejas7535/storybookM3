import { Colors, Component, Rect } from '@schaeffler/pdf-generator';

import { CardBaseComponent } from './base-component';

class TestCardBaseComponent extends CardBaseComponent {
  public override render(): void {
    super.render();
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, (Component | undefined)?, (Component | undefined)?] {
    this.bounds = bounds;

    return [true, 100];
  }

  public getBackgroundColor(): string {
    return this.backgroundColor;
  }

  public getPadding(): number {
    return this.padding;
  }

  public getMargin(): number {
    return this.margin;
  }

  public getCalculatedHeight(): number {
    return this.calculatedHeight;
  }

  public callRenderBackground(): void {
    this.renderBackground();
  }
}

describe('CardBaseComponent', () => {
  let component: TestCardBaseComponent;
  let mockJsPdf: any;
  let mockPdfDoc: any;

  beforeEach(() => {
    mockJsPdf = {
      setFillColor: jest.fn(),
      rect: jest.fn(),
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Arial', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
    };

    mockPdfDoc = {
      pdfDoc: mockJsPdf,
      reset: jest.fn(),
    };

    component = new TestCardBaseComponent();
    component.setDocument(mockPdfDoc as any);
    component.setBounds(new Rect(10, 20, 30, 200));
    component['calculatedHeight'] = 50;
  });

  describe('Default values', () => {
    it('should initialize with default values', () => {
      expect(component.getBackgroundColor()).toBe(Colors.Surface);
      expect(component.getPadding()).toBe(0);
      expect(component.getMargin()).toBe(0);
      expect(component.getCalculatedHeight()).toBe(50);
    });
  });

  describe('renderBackground', () => {
    it('should render the background', () => {
      component.callRenderBackground();

      expect(mockJsPdf.setFillColor).toHaveBeenCalledWith(Colors.Surface);
      expect(mockJsPdf.rect).toHaveBeenCalledWith(10, 20, 200, 50, 'F');
    });

    it('should not render background when backgroundColor is not set', () => {
      component['backgroundColor'] = '';
      component.callRenderBackground();

      expect(mockJsPdf.setFillColor).not.toHaveBeenCalled();
      expect(mockJsPdf.rect).not.toHaveBeenCalled();
    });
  });
});
