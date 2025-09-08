import { Rect } from '../core/rect';
import { PDFHeader, PDFHeaderProps } from './pdf-header.component';

describe('PDFHeader', () => {
  let component: PDFHeader;
  let mockPdfDoc: any;
  const defaultProps: PDFHeaderProps = {
    reportTitle: 'Test Report',
  };

  beforeEach(() => {
    const mockJsPdf = {
      setFillColor: jest.fn(),
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(),
      roundedRect: jest.fn(),
      rect: jest.fn(),
      setFont: jest.fn(),
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Noto', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
      getTextDimensions: jest.fn().mockReturnValue({ w: 50, h: 10 }),
      getTextWidth: jest.fn().mockReturnValue(50),
      internal: {
        pageSize: {
          getWidth: jest.fn().mockReturnValue(595),
          getHeight: jest.fn().mockReturnValue(842),
        },
      },
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };

    component = new PDFHeader(defaultProps);
    component.setDocument(mockPdfDoc);

    jest
      .spyOn(component as any, 'getTextDimensions')
      .mockReturnValue({ w: 80, h: 12 });
    jest.spyOn(component as any, 'scaleImage').mockReturnValue([30, 4]);
    jest.spyOn(component as any, 'image').mockImplementation(() => {});
    jest.spyOn(component as any, 'text').mockImplementation(() => {});
    jest.spyOn(component as any, 'hcenter').mockReturnValue(100);
    jest.spyOn(component as any, 'vcenter').mockReturnValue(50);
    jest
      .spyOn(component as any, 'assertDoc')
      .mockReturnValue(mockPdfDoc.pdfDoc);
  });

  describe('constructor', () => {
    it('should create an instance with default properties', () => {
      expect(component).toBeTruthy();
      expect((component as any).reportTitle).toBe('Test Report');
      expect((component as any).includeQR).toBe(false);
    });

    it('should create an instance with custom properties', () => {
      const customProps: PDFHeaderProps = {
        reportTitle: 'Custom Report',
        date: {
          formattedDate: '2023-12-01',
          dateLocale: 'de',
        },
        headerLink: {
          target: 'https://example.com',
          linkText: 'Visit Site',
          showQRCode: true,
        },
        format: {
          title: { fontSize: 16, fontStyle: 'bold' },
          date: { fontSize: 12 },
          linkText: { fontSize: 9 },
        },
        heading: 'Custom Heading',
        headingDescription: 'This is a description',
      };

      const customComponent = new PDFHeader(customProps);

      expect((customComponent as any).reportTitle).toBe('Custom Report');
      expect((customComponent as any).creationDate).toBe('2023-12-01');
      expect((customComponent as any).headerLink).toBe('https://example.com');
      expect((customComponent as any).headerLinkText).toBe('Visit Site');
      expect((customComponent as any).includeQR).toBe(true);
      expect((customComponent as any).heading).toBe('Custom Heading');
      expect((customComponent as any).headingDescription).toBe(
        'This is a description'
      );
      expect((customComponent as any).titleFormat.fontSize).toBe(16);
      expect((customComponent as any).dateFontFormat.fontSize).toBe(12);
      expect((customComponent as any).linkTextFormat.fontSize).toBe(9);
    });

    it('should create an instance with heading description only when heading is provided', () => {
      const propsWithDescriptionOnly: PDFHeaderProps = {
        reportTitle: 'Test Report',
        headingDescription: 'Description without heading',
      };

      const componentWithDescriptionOnly = new PDFHeader(
        propsWithDescriptionOnly
      );
      expect((componentWithDescriptionOnly as any).headingDescription).toBe(
        'Description without heading'
      );
      expect((componentWithDescriptionOnly as any).heading).toBeUndefined();
    });

    it('should use default title when none provided', () => {
      const propsWithoutTitle: PDFHeaderProps = {
        reportTitle: '',
      };
      const componentWithoutTitle = new PDFHeader(propsWithoutTitle);

      expect((componentWithoutTitle as any).reportTitle).toBe(
        'Untitled report'
      );
    });

    it('should generate creation date when none provided', () => {
      const componentWithAutoDate = new PDFHeader(defaultProps);

      expect((componentWithAutoDate as any).creationDate).toBeDefined();
      expect(typeof (componentWithAutoDate as any).creationDate).toBe('string');
    });

    it('should merge custom font options with defaults', () => {
      const partialFormat: PDFHeaderProps = {
        reportTitle: 'Test',
        format: {
          title: { fontSize: 18 },
          date: { fontStyle: 'italic' },
        },
      };

      const customComponent = new PDFHeader(partialFormat);

      expect((customComponent as any).titleFormat).toEqual({
        fontFamily: 'Noto',
        fontStyle: 'bold',
        fontSize: 18,
      });

      expect((customComponent as any).dateFontFormat).toEqual({
        fontFamily: 'Noto',
        fontSize: 10,
        fontStyle: 'italic',
      });
    });
  });

  describe('evaluate', () => {
    it('should return true when header fits in the bounds', () => {
      const bounds = new Rect(0, 0, 400, 200);

      jest
        .spyOn(component as any, 'getRequiredVerticalSpace')
        .mockReturnValue(50);

      const [fits, height, fittingComponent, overflowComponent] =
        component.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(50);
      expect(fittingComponent).toBeUndefined();
      expect(overflowComponent).toBeUndefined();
    });

    it('should return false when header does not fit in the bounds', () => {
      const testComponent = new PDFHeader(defaultProps);
      testComponent.setDocument(mockPdfDoc);

      jest
        .spyOn(testComponent as any, 'getRequiredVerticalSpace')
        .mockReturnValue(50);
      jest
        .spyOn(testComponent as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 400, 30);
      const [fits, height, fittingComponent, overflowComponent] =
        testComponent.evaluate(bounds);

      expect(fits).toBe(height <= bounds.height);
      expect(height).toBe(50);
      expect(fittingComponent).toBeUndefined();
      expect(overflowComponent).toBe(
        height > bounds.height ? testComponent : undefined
      );
    });

    it('should calculate required vertical space correctly', () => {
      const bounds = new Rect(0, 0, 400, 200);

      const [_fits, height] = component.evaluate(bounds);

      expect(height).toBeGreaterThan(0);
      expect(typeof height).toBe('number');
    });
  });

  describe('render', () => {
    beforeEach(() => {
      const bounds = new Rect(10, 20, 400, 100);
      component.setBounds(bounds);
      component.evaluate(bounds);
    });

    it('should render basic header without QR code', () => {
      component.render();

      expect(mockPdfDoc.pdfDoc.setFont).toHaveBeenCalledWith('Noto');

      expect((component as any).image).toHaveBeenCalled();

      expect((component as any).text).toHaveBeenCalledWith(
        100,
        50,
        expect.any(String),
        expect.objectContaining({
          fontOptions: expect.any(Object),
        })
      );
    });

    it('should render header with QR code when enabled', () => {
      const propsWithQR: PDFHeaderProps = {
        reportTitle: 'Test Report',
        headerLink: {
          target: 'https://example.com',
          showQRCode: true,
        },
      };

      const componentWithQR = new PDFHeader(propsWithQR);
      componentWithQR.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithQR as any, 'getTextDimensions')
        .mockReturnValue({ w: 80, h: 12 });
      jest.spyOn(componentWithQR as any, 'scaleImage').mockReturnValue([30, 4]);
      jest.spyOn(componentWithQR as any, 'image').mockImplementation(() => {});
      jest.spyOn(componentWithQR as any, 'text').mockImplementation(() => {});
      jest.spyOn(componentWithQR as any, 'hcenter').mockReturnValue(100);
      jest.spyOn(componentWithQR as any, 'vcenter').mockReturnValue(50);
      jest
        .spyOn(componentWithQR as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(10, 20, 400, 100);
      componentWithQR.setBounds(bounds);
      componentWithQR.evaluate(bounds);
      componentWithQR.render();

      expect(mockPdfDoc.pdfDoc.rect).toHaveBeenCalled();

      expect((componentWithQR as any).image).toHaveBeenCalled();
    });

    it('should render header link when provided', () => {
      const propsWithLink: PDFHeaderProps = {
        reportTitle: 'Test Report',
        headerLink: {
          target: 'https://example.com',
          linkText: 'Visit Example',
        },
      };

      const componentWithLink = new PDFHeader(propsWithLink);
      componentWithLink.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithLink as any, 'getTextDimensions')
        .mockReturnValue({ w: 80, h: 12 });
      jest
        .spyOn(componentWithLink as any, 'scaleImage')
        .mockReturnValue([30, 4]);
      jest
        .spyOn(componentWithLink as any, 'image')
        .mockImplementation(() => {});
      jest.spyOn(componentWithLink as any, 'text').mockImplementation(() => {});
      jest.spyOn(componentWithLink as any, 'hcenter').mockReturnValue(100);
      jest.spyOn(componentWithLink as any, 'vcenter').mockReturnValue(50);
      jest
        .spyOn(componentWithLink as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(10, 20, 400, 100);
      componentWithLink.setBounds(bounds);
      componentWithLink.evaluate(bounds);
      componentWithLink.render();

      expect((componentWithLink as any).text).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'Visit Example',
        expect.objectContaining({
          link: 'https://example.com',
          fontOptions: expect.any(Object),
        })
      );
    });

    it('should render heading when provided', () => {
      const propsWithHeading: PDFHeaderProps = {
        reportTitle: 'Test Report',
        heading: 'Section Heading',
      };

      const componentWithHeading = new PDFHeader(propsWithHeading);
      componentWithHeading.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithHeading as any, 'getTextDimensions')
        .mockReturnValue({ w: 80, h: 12 });
      jest
        .spyOn(componentWithHeading as any, 'scaleImage')
        .mockReturnValue([30, 4]);
      jest
        .spyOn(componentWithHeading as any, 'image')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithHeading as any, 'text')
        .mockImplementation(() => {});
      jest.spyOn(componentWithHeading as any, 'hcenter').mockReturnValue(100);
      jest.spyOn(componentWithHeading as any, 'vcenter').mockReturnValue(50);
      jest
        .spyOn(componentWithHeading as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(10, 20, 400, 100);
      componentWithHeading.setBounds(bounds);
      componentWithHeading.evaluate(bounds);
      componentWithHeading.render();

      expect((componentWithHeading as any).text).toHaveBeenCalledWith(
        bounds.x,
        expect.any(Number),
        'Section Heading',
        expect.objectContaining({
          fontOptions: expect.any(Object),
        })
      );
    });

    it('should render heading description when both heading and description are provided', () => {
      const propsWithHeadingAndDescription: PDFHeaderProps = {
        reportTitle: 'Test Report',
        heading: 'Section Heading',
        headingDescription: 'Additional description text',
      };

      const componentWithHeadingAndDescription = new PDFHeader(
        propsWithHeadingAndDescription
      );
      componentWithHeadingAndDescription.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithHeadingAndDescription as any, 'getTextDimensions')
        .mockReturnValue({ w: 80, h: 12 });
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'scaleImage')
        .mockReturnValue([30, 4]);
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'image')
        .mockImplementation(() => {});
      const textSpy = jest
        .spyOn(componentWithHeadingAndDescription as any, 'text')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'hcenter')
        .mockReturnValue(100);
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'vcenter')
        .mockReturnValue(50);
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(10, 20, 400, 100);
      componentWithHeadingAndDescription.setBounds(bounds);
      componentWithHeadingAndDescription.evaluate(bounds);
      componentWithHeadingAndDescription.render();

      // Verify heading is rendered
      expect(textSpy).toHaveBeenCalledWith(
        bounds.x,
        expect.any(Number),
        'Section Heading',
        expect.objectContaining({
          fontOptions: expect.any(Object),
        })
      );

      // Verify heading description is rendered with correct positioning
      expect(textSpy).toHaveBeenCalledWith(
        bounds.x + 80 + 6, // heading width + offset
        expect.any(Number),
        'Additional description text',
        expect.objectContaining({
          fontOptions: expect.objectContaining({
            fontFamily: 'Noto',
            fontSize: 8,
          }),
        })
      );
    });

    it('should not render heading description when only description is provided without heading', () => {
      const propsWithDescriptionOnly: PDFHeaderProps = {
        reportTitle: 'Test Report',
        headingDescription: 'Description without heading',
      };

      const componentWithDescriptionOnly = new PDFHeader(
        propsWithDescriptionOnly
      );
      componentWithDescriptionOnly.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithDescriptionOnly as any, 'getTextDimensions')
        .mockReturnValue({ w: 80, h: 12 });
      jest
        .spyOn(componentWithDescriptionOnly as any, 'scaleImage')
        .mockReturnValue([30, 4]);
      jest
        .spyOn(componentWithDescriptionOnly as any, 'image')
        .mockImplementation(() => {});
      const textSpy = jest
        .spyOn(componentWithDescriptionOnly as any, 'text')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithDescriptionOnly as any, 'hcenter')
        .mockReturnValue(100);
      jest
        .spyOn(componentWithDescriptionOnly as any, 'vcenter')
        .mockReturnValue(50);
      jest
        .spyOn(componentWithDescriptionOnly as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(10, 20, 400, 100);
      componentWithDescriptionOnly.setBounds(bounds);
      componentWithDescriptionOnly.evaluate(bounds);
      componentWithDescriptionOnly.render();

      // Verify that description text is not rendered when there's no heading
      expect(textSpy).not.toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'Description without heading',
        expect.any(Object)
      );
    });

    it('should position heading description correctly relative to heading text', () => {
      const propsWithHeadingAndDescription: PDFHeaderProps = {
        reportTitle: 'Test Report',
        heading: 'Short',
        headingDescription: 'Long description text',
      };

      const componentWithHeadingAndDescription = new PDFHeader(
        propsWithHeadingAndDescription
      );
      componentWithHeadingAndDescription.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithHeadingAndDescription as any, 'getTextDimensions')
        .mockReturnValue({ w: 40, h: 12 });
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'scaleImage')
        .mockReturnValue([30, 4]);
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'image')
        .mockImplementation(() => {});
      const textSpy = jest
        .spyOn(componentWithHeadingAndDescription as any, 'text')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'hcenter')
        .mockReturnValue(100);
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'vcenter')
        .mockReturnValue(50);
      jest
        .spyOn(componentWithHeadingAndDescription as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(10, 20, 400, 100);
      componentWithHeadingAndDescription.setBounds(bounds);
      componentWithHeadingAndDescription.evaluate(bounds);
      componentWithHeadingAndDescription.render();

      // Verify heading description is positioned with correct x-coordinate
      expect(textSpy).toHaveBeenCalledWith(
        bounds.x + 40 + 6, // heading width (40) + offset (6)
        expect.any(Number),
        'Long description text',
        expect.objectContaining({
          fontOptions: expect.any(Object),
        })
      );
    });

    it('should use header link as link text when linkText not provided', () => {
      const propsWithLinkOnly: PDFHeaderProps = {
        reportTitle: 'Test Report',
        headerLink: {
          target: 'https://example.com',
        },
      };

      const componentWithLinkOnly = new PDFHeader(propsWithLinkOnly);
      componentWithLinkOnly.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithLinkOnly as any, 'getTextDimensions')
        .mockReturnValue({ w: 80, h: 12 });
      jest
        .spyOn(componentWithLinkOnly as any, 'scaleImage')
        .mockReturnValue([30, 4]);
      jest
        .spyOn(componentWithLinkOnly as any, 'image')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithLinkOnly as any, 'text')
        .mockImplementation(() => {});
      jest.spyOn(componentWithLinkOnly as any, 'hcenter').mockReturnValue(100);
      jest.spyOn(componentWithLinkOnly as any, 'vcenter').mockReturnValue(50);
      jest
        .spyOn(componentWithLinkOnly as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(10, 20, 400, 100);
      componentWithLinkOnly.setBounds(bounds);
      componentWithLinkOnly.evaluate(bounds);
      componentWithLinkOnly.render();

      expect((componentWithLinkOnly as any).text).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'https://example.com',
        expect.objectContaining({
          link: 'https://example.com',
          fontOptions: expect.any(Object),
        })
      );
    });
  });

  describe('getRequiredVerticalSpace', () => {
    it('should calculate space for basic header', () => {
      const space = (component as any).getRequiredVerticalSpace();
      expect(space).toBe(4); // LOGO_HEIGHT
    });

    it('should calculate space for header with QR code', () => {
      const propsWithQR: PDFHeaderProps = {
        reportTitle: 'Test Report',
        headerLink: {
          target: 'https://example.com',
          showQRCode: true,
        },
      };

      const componentWithQR = new PDFHeader(propsWithQR);
      componentWithQR.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithQR as any, 'getTextDimensions')
        .mockReturnValue({ w: 80, h: 12 });
      jest
        .spyOn(componentWithQR as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const space = (componentWithQR as any).getRequiredVerticalSpace();
      expect(space).toBeGreaterThan(25); // QR_CODE_SIZE + additional space
    });

    it('should calculate space for header with heading', () => {
      const propsWithHeading: PDFHeaderProps = {
        reportTitle: 'Test Report',
        heading: 'Section Heading',
      };

      const componentWithHeading = new PDFHeader(propsWithHeading);
      componentWithHeading.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithHeading as any, 'getTextDimensions')
        .mockReturnValue({ w: 80, h: 12 });
      jest
        .spyOn(componentWithHeading as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const space = (componentWithHeading as any).getRequiredVerticalSpace();
      expect(space).toBeGreaterThan(4); // LOGO_HEIGHT + heading space
    });
  });
});
