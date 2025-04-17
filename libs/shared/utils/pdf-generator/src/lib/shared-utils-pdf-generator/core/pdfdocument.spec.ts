import { FontConfig } from '../angular/font-resolver.service';
import { Component } from './component';
import { PDFDocument } from './pdfdocument';
import { Rect } from './rect';

describe('PDFDocument', () => {
  let doc: PDFDocument;

  const getMockComponent = (
    evaluateReturn: ReturnType<Component['evaluate']>
  ) => {
    const mockComponent = {
      evaluate: jest.fn(() => evaluateReturn),
      setBounds: jest.fn(),
      setDocument: jest.fn(),
      render: jest.fn(),
      setDebug: jest.fn(),
    } as any;

    return mockComponent as any as Component;
  };

  beforeEach(() => {
    doc = new PDFDocument();
  });

  it('addComponent should expand the components', () => {
    doc.addComponent({} as Component);
    doc.addComponent({} as Component);
    expect(doc['components'].length).toEqual(2);
  });

  describe('setDebug', () => {
    it('should be called when the document is in debug mode', () => {
      doc.setDebug(true);
      const comp = getMockComponent([true, 100]);
      doc.addComponent(comp);
      doc.generate();
      expect(comp.setDebug).toHaveBeenCalledWith(true);
    });

    it('should be not called when the document is not in debug mode', () => {
      doc.setDebug(false);
      const comp = getMockComponent([true, 100]);
      doc.addComponent(comp);
      doc.generate();
      expect(comp.setDebug).toHaveBeenCalledWith(false);
    });
  });

  it('setPageMargin should update the marings and the starting vpos', () => {
    const margins = { top: 50, left: 10, right: 10, bottom: 10 };
    doc.setPageMargin(margins);
    expect(doc['pageMargins']).toEqual(margins);
    expect(doc['currentVpos']).toEqual(margins.top);
  });

  describe('addHeader', () => {
    it('should validate if a header is already present', () => {
      doc['header'] = {} as Component;
      expect(() => {
        doc.addHeader({} as Component);
      }).toThrow(Error);
    });

    it('should update the static margins', () => {
      const component = {} as Component;
      component.evaluate = jest.fn(() => [true, 100]);
      component.setDocument = jest.fn();
      doc.addHeader(component);
      expect(doc['staticElementHeight'].header).toEqual(100);
      expect(component.evaluate).toHaveBeenCalled();
      expect(component.setDocument).toHaveBeenCalled();
    });

    it('should error on incorrect component behavior', () => {
      const component = {} as Component;
      component.evaluate = jest.fn(() => [false, 100]);
      expect(() => {
        doc.addHeader(component);
      }).toThrow();
    });
  });

  describe('addFooter', () => {
    it('should validate if a footer is already present', () => {
      doc['footer'] = {} as Component;
      expect(() => {
        doc.addFooter({} as Component);
      }).toThrow(Error);
    });

    it('should update the static margins', () => {
      const component = {} as Component;
      component.evaluate = jest.fn(() => [true, 100]);
      component.setDocument = jest.fn();
      doc.addFooter(component);
      expect(doc['staticElementHeight'].footer).toEqual(100);
      expect(component.evaluate).toHaveBeenCalled();
      expect(component.setDocument).toHaveBeenCalled();
    });

    it('should error on incorrect component behavior', () => {
      const component = {} as Component;
      component.evaluate = jest.fn(() => [false, 100]);
      expect(() => {
        doc.addFooter(component);
      }).toThrow();
    });
  });

  describe('insets', () => {
    it('should ingore the header and footer if none are present', () => {
      const margins = doc.getPageMargins();
      expect(doc['insets']('left')).toEqual(margins.left);
      expect(doc['insets']('top')).toEqual(margins.top);
    });

    it('should account for headers and footers if present', () => {
      doc['staticElementHeight'].header = 100;
      const margins = doc.getPageMargins();
      expect(doc['insets']('left')).toEqual(margins.left);
      expect(doc['insets']('top')).toEqual(margins.top + 100);
    });
  });

  describe('vshift', () => {
    it('should shift if enough space remains', () => {
      doc['validVPosBounds'] = jest.fn(() => true);
      doc['addPageBreak'] = jest.fn();
      doc['vshift'](50);
      expect(doc['currentVpos']).toEqual(50);
      expect(doc['validVPosBounds']).toHaveBeenCalled();
      expect(doc['addPageBreak']).not.toHaveBeenCalled();
    });

    it('should add a page break if we go below the bottom margin', () => {
      doc['validVPosBounds'] = jest.fn(() => false);
      doc['addPageBreak'] = jest.fn();
      doc['vshift'](50);
      expect(doc['currentVpos']).toEqual(50);
      expect(doc['validVPosBounds']).toHaveBeenCalled();
      expect(doc['addPageBreak']).toHaveBeenCalled();
    });
  });

  it('addPageBreak should reset to the top margin', () => {
    doc['insets'] = jest.fn(() => 150);
    doc['addPageBreak']();
    expect(doc['insets']).toHaveBeenCalledWith('top');
  });

  describe('validVposBounds', () => {
    it('should be true the line is above the lower margin', () => {
      doc['currentVpos'] = 20;
      doc['insets'] = jest.fn(() => 10);

      const getheightspy = jest.spyOn(
        doc['pdfDoc'].internal.pageSize,
        'getHeight'
      );
      getheightspy.mockImplementation(() => 200);

      const returnValue = doc['validVPosBounds']();
      expect(returnValue).toEqual(true);
      expect(getheightspy).toHaveBeenCalled();
    });

    it('should be false if the vertical line is below the lower margin', () => {
      doc['currentVpos'] = 190;
      doc['insets'] = jest.fn(() => 10);

      const getheightspy = jest.spyOn(
        doc['pdfDoc'].internal.pageSize,
        'getHeight'
      );
      getheightspy.mockImplementation(() => 200);

      const returnValue = doc['validVPosBounds']();
      expect(returnValue).toEqual(false);
      expect(getheightspy).toHaveBeenCalled();
    });
  });

  describe('getPageRect', () => {
    let insetsMock: jest.Func;

    beforeEach(() => {
      insetsMock = jest.fn(() => 10);
      doc['insets'] = insetsMock;

      doc['pdfDoc'].internal.pageSize = {
        getHeight: jest.fn(() => 400),
        getWidth: jest.fn(() => 400),
        height: 400,
        width: 400,
      };

      const margins = {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
      };

      doc['pageMargins'] = margins;
    });

    it('should get the entire page minus the margins at the very beginning', () => {
      doc['currentVpos'] = 10;
      const rect = doc['getPageRect']();
      expect(rect.x).toEqual(10);
      expect(rect.y).toEqual(10);
      expect(rect.height).toEqual(380);
      expect(rect.width).toEqual(380);

      expect(insetsMock).toHaveBeenCalled();
    });

    it('should account for the current vpos', () => {
      doc['currentVpos'] = 50;

      const rect = doc['getPageRect']();
      expect(rect.x).toEqual(10);
      expect(rect.y).toEqual(50);
      expect(rect.height).toEqual(340);
      expect(rect.width).toEqual(380);

      expect(insetsMock).toHaveBeenCalled();
    });
  });

  it('addFont should call through to the jsPDF lib', () => {
    const addFontSpy = jest
      .spyOn(doc['pdfDoc'], 'addFont')
      .mockImplementation(() => 'worked');
    const addVFSSpy = jest
      .spyOn(doc['pdfDoc'], 'addFileToVFS')
      .mockImplementation();
    const fontConfig: FontConfig = {
      fontName: 'Raleway',
      fileName: 'Raleway.ttf',
      fontStyle: 'Regular',
      fontData: 'totallyvalidfontdata',
    };
    doc.addFont(fontConfig);
    expect(addFontSpy).toHaveBeenCalledWith(
      'Raleway.ttf',
      'Raleway',
      'Regular'
    );
    expect(addVFSSpy).toHaveBeenCalledWith(
      'Raleway.ttf',
      'totallyvalidfontdata'
    );
  });

  describe('Generate', () => {
    beforeEach(() => {
      doc['prepend'] = jest.fn();
      doc['vshift'] = jest.fn();
      doc['addPageBreak'] = jest.fn();
      doc['getPageRect'] = jest.fn(() => new Rect(0, 0, 500, 500));
    });

    it('fitting components should be rendered immediately', () => {
      const componentMock = getMockComponent([true, 100]);
      doc['components'].push(componentMock);

      doc.generate();
      expect(componentMock.setDocument).toHaveBeenCalledWith(doc);
      expect(componentMock.setBounds).toHaveBeenCalled();
      expect(componentMock.evaluate).toHaveBeenCalled();
      expect(doc['vshift']).toHaveBeenCalledWith(100);
      expect(doc['prepend']).not.toHaveBeenCalled();
      expect(componentMock.render).toHaveBeenCalled();
    });

    it('should split up the fitting part if a component does not fit the page completely', () => {
      const fittingSubcomponent = getMockComponent([true, 100]);
      const remainderSubcomponent = getMockComponent([true, 100]);
      const notFittingParentComponent = getMockComponent([
        false,
        200,
        fittingSubcomponent,
        remainderSubcomponent,
      ]);

      doc.addComponent(notFittingParentComponent);
      expect(doc['components'].length).toEqual(1);
      doc.generate();
      expect(doc['prepend']).toHaveBeenCalledTimes(2);
      expect(doc['prepend']).toHaveBeenNthCalledWith(1, remainderSubcomponent);
      expect(doc['prepend']).toHaveBeenNthCalledWith(2, fittingSubcomponent);

      expect(doc['vshift']).not.toHaveBeenCalled();
      expect(notFittingParentComponent.render).not.toHaveBeenCalled();
      expect(notFittingParentComponent.setBounds).not.toHaveBeenCalled();
      expect(notFittingParentComponent.setDocument).toHaveBeenCalledWith(doc);
    });
  });
});
