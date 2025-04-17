import jsPDF, { Font, ImageProperties } from 'jspdf';

import { Component } from './component';
import { FontOptions } from './format';
import { PDFDocument } from './pdfdocument';
import { Rect } from './rect';

const mockFont = {
  id: 999,
  fontName: 'Noto',
  fontStyle: 'normal',
} as Font;

class TestingComponent extends Component {}

describe('Component', () => {
  let component: Component;
  let pdfMock: jsPDF;

  const componentFactory = () => {
    component = new TestingComponent();
    pdfMock = {
      setFontSize: jest.fn(),
      setFont: jest.fn(),
      getStringUnitWidth: jest.fn(() => 10),
      getLineHeightFactor: jest.fn(() => 1),
      rect: jest.fn(),
      getFontSize: jest.fn(() => 11),
      getFont: jest.fn(() => mockFont),
      getImageProperties: jest.fn(),
      addImage: jest.fn(),
      line: jest.fn(),
      setDrawColor: jest.fn(),
      getDrawColor: jest.fn(),
      getTextDimensions: jest.fn(),
      internal: {
        pageSize: {
          getWidth: jest.fn(() => 100),
          getHeight: jest.fn(() => 100),
        },
      },
    } as any as jsPDF;

    jest.clearAllMocks();
    component['_doc'] = pdfMock;
    component['_pdfDoc'] = {
      reset: jest.fn(),
    } as any as PDFDocument;
  };

  beforeEach(() => {
    componentFactory();
  });

  describe('assertDoc', () => {
    it('should throw when doc is not set', () => {
      component['_doc'] = undefined;
      expect(() => component['assertDoc']()).toThrow();
    });

    it('should return the doc when it is set', () => {
      expect(component['assertDoc']()).toEqual(pdfMock);
    });
  });

  describe('drawDebug', () => {
    it('should error when the bounds have not been set', () => {
      component.setDebug(true);
      expect(() => {
        component['drawDebug']();
      }).toThrow();
    });

    it('should call jspdf.rect when debug is set to true', () => {
      component.setDebug(true);
      component.setBounds(new Rect(0, 0, 100, 100));
      component['drawDebug']();
      expect(component['_doc']?.rect).toHaveBeenCalled();
    });

    it('should not call jspdf.rect when debug is set to false', () => {
      component.setDebug(false);
      component.setBounds(new Rect(0, 0, 100, 100));
      component['drawDebug']();
      expect(component['_doc']?.rect).not.toHaveBeenCalled();
    });
  });

  it('evaluate should call reset and update bounds', () => {
    const bounds = new Rect(0, 0, 50, 50);
    const evaluationResult = component.evaluate(bounds);
    expect(component['_pdfDoc']?.reset).toHaveBeenCalled();
    expect(component['bounds']).toEqual(bounds);

    expect(evaluationResult).toEqual([false, 0]);
  });

  describe('render', () => {
    it('should error when bounds is unset', () => {
      expect(() => {
        component.render();
      }).toThrow();
    });

    it('should call through to render debug', () => {
      component['drawDebug'] = jest.fn();
      component['bounds'] = new Rect(0, 0, 50, 50);
      component.render();
      expect(component['drawDebug']).toHaveBeenCalled();
    });
  });

  describe('getLineHeight', () => {
    it('should throw if the doc is unset', () => {
      component['_doc'] = undefined;
      expect(() => component['getLineHeight']()).toThrow();
    });

    it('should return the line hight for the current font style if no different style is provided', () => {
      component['getLineHeight']();
      component['temporaryFontStyle'] = jest.fn();
      expect(pdfMock.getLineHeightFactor).toHaveBeenCalled();
      expect(pdfMock.getFontSize).toHaveBeenCalled();
      expect(component['temporaryFontStyle']).not.toHaveBeenCalled();
    });

    it('should call out to temporary apply the supplied style', () => {
      const fontStyle: FontOptions = { fontFamily: 'Emoji Font', fontSize: 22 };

      const mockClosure = jest.fn();
      component['temporaryFontStyle'] = jest.fn(() => mockClosure);

      component['getLineHeight'](fontStyle);
      expect(pdfMock.getLineHeightFactor).toHaveBeenCalled();
      expect(pdfMock.getFontSize).toHaveBeenCalled();
      expect(component['temporaryFontStyle']).toHaveBeenCalledWith(fontStyle);

      expect(mockClosure).toHaveBeenCalled();
    });
  });

  describe('temporaryFontStyle', () => {
    it('should error when doc is not set', () => {
      component['_doc'] = undefined;
      expect(() => {
        component['temporaryFontStyle']({ fontFamily: 'Noto' });
      }).toThrow();
    });

    it('should apply the font styles that have been passed to it conditionally', () => {
      component['temporaryFontStyle']({ fontFamily: 'Noto' });

      expect(pdfMock.getFont).toHaveBeenCalled();
      expect(pdfMock.getFontSize).toHaveBeenCalled();
      expect(pdfMock.setFont).toHaveBeenCalledWith('Noto', 'normal');
      expect(pdfMock.setFontSize).not.toHaveBeenCalled();

      componentFactory();

      component['temporaryFontStyle']({ fontSize: 14 });

      expect(pdfMock.getFont).toHaveBeenCalled();
      expect(pdfMock.getFontSize).toHaveBeenCalled();
      expect(pdfMock.setFont).not.toHaveBeenCalled();
      expect(pdfMock.setFontSize).toHaveBeenCalledWith(14);
    });

    it('should reset the fonts style to the previous values when reset is called', () => {
      const resetFunc = component['temporaryFontStyle']({
        fontSize: 15,
        fontFamily: 'Raleway',
      });
      expect(resetFunc).toBeTruthy();

      expect(pdfMock.getFont).toHaveBeenCalled();
      expect(pdfMock.getFontSize).toHaveBeenCalled();
      expect(pdfMock.setFont).toHaveBeenCalledWith('Raleway', 'normal');
      expect(pdfMock.setFontSize).toHaveBeenCalledWith(15);
      resetFunc();
      expect(pdfMock.setFontSize).toHaveBeenCalledWith(11);
      expect(pdfMock.setFont).toHaveBeenCalledWith('Noto', 'normal');
    });
  });

  describe('image', () => {
    let imagePropertiesMock: jest.MockedFn<jsPDF['getImageProperties']>;
    beforeEach(() => {
      imagePropertiesMock = pdfMock['getImageProperties'] as jest.MockedFn<
        jsPDF['getImageProperties']
      >;
    });

    it('should give the original size if both width and height are undefined', () => {
      imagePropertiesMock.mockReturnValue({
        width: 100,
        height: 100,
      } as ImageProperties);

      component['image']('test', 0, 0);

      expect(imagePropertiesMock).toHaveBeenCalled();
      expect(pdfMock['addImage']).toHaveBeenCalledWith('test', 0, 0, 100, 100);
    });

    it('should scale the width while retaining the aspect ratio when a height is supplied', () => {
      imagePropertiesMock.mockReturnValue({
        width: 150,
        height: 300,
      } as ImageProperties);

      component['image']('test', 0, 0, undefined, 100);

      expect(imagePropertiesMock).toHaveBeenCalled();
      expect(pdfMock['addImage']).toHaveBeenCalledWith('test', 0, 0, 50, 100);
    });

    it('should scale the height while retaining the aspect ratio when a width is supplied', () => {
      imagePropertiesMock.mockReturnValue({
        width: 100,
        height: 200,
      } as ImageProperties);

      component['image']('test', 0, 0, 50);

      expect(imagePropertiesMock).toHaveBeenCalled();
      expect(pdfMock['addImage']).toHaveBeenCalledWith('test', 0, 0, 50, 100);
    });

    it('should use the supplied arguments when both width and height are set', () => {
      imagePropertiesMock.mockReturnValue({
        width: 150,
        height: 150,
      } as ImageProperties);

      component['image']('test', 0, 0, 50, 50);

      expect(imagePropertiesMock).toHaveBeenCalled();
      expect(pdfMock['addImage']).toHaveBeenCalledWith('test', 0, 0, 50, 50);
    });
  });

  describe('vline', () => {
    it('should draw a horizontal line', () => {
      const getDrawColorMock = pdfMock.getDrawColor as jest.Mock;
      component['hline'](10);

      expect(getDrawColorMock).not.toHaveBeenCalled();
      expect(pdfMock['line']).toHaveBeenCalledWith(0, 10, 100, 10);
    });

    it('should draw a horizontal line with a specific color', () => {
      const getDrawColorMock = pdfMock.getDrawColor as jest.Mock;
      getDrawColorMock.mockReturnValue('blue');
      component['hline'](10, 'orange');

      expect(getDrawColorMock).toHaveBeenCalledTimes(1);
      expect(pdfMock['setDrawColor']).toHaveBeenCalledTimes(2);
      expect(pdfMock['setDrawColor']).toHaveBeenNthCalledWith(1, 'orange');
      expect(pdfMock['line']).toHaveBeenCalledWith(0, 10, 100, 10);
      expect(pdfMock['setDrawColor']).toHaveBeenLastCalledWith('blue');
    });
  });

  describe('getTextDimensions', () => {
    let temporaryFontStyleMock: jest.Mock;
    let temporaryFontStyleMockReturnFn: jest.Mock;

    beforeEach(() => {
      temporaryFontStyleMockReturnFn = jest.fn();
      temporaryFontStyleMock = jest.fn(() => temporaryFontStyleMockReturnFn);
      (pdfMock['getFont'] as jest.Mock).mockReturnValue(mockFont);
      component['temporaryFontStyle'] = temporaryFontStyleMock;
    });

    it('should call through when provided with no options', () => {
      component['getTextDimensions']('testtext');

      expect(pdfMock['getTextDimensions']).toHaveBeenCalledWith(
        'testtext',
        undefined
      );
    });

    it('should call through when provided with a maxWidth argument', () => {
      component['getTextDimensions']('testtext', { maxWidth: 100 });

      expect(pdfMock['getTextDimensions']).toHaveBeenCalledWith('testtext', {
        maxWidth: 100,
      });
      expect(temporaryFontStyleMock).not.toHaveBeenCalled();
    });

    it('should apply a provided font style temporarily', () => {
      component['getTextDimensions']('testtext', {
        maxWidth: 100,
        font: 'Noto',
        fontSize: 12,
      });

      expect(temporaryFontStyleMock).toHaveBeenCalledWith({
        fontFamily: 'Noto',
        fontSize: 12,
      });
      expect(pdfMock['getTextDimensions']).toHaveBeenCalledWith('testtext', {
        maxWidth: 100,
      });
      expect(temporaryFontStyleMockReturnFn).toHaveBeenCalled();
    });
  });
});
