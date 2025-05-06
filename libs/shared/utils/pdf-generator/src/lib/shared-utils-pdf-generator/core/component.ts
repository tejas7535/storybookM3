import { jsPDF } from 'jspdf';

import { FontOptions } from './format';
import { PDFDocument } from './pdfdocument';
import { Rect } from './rect';

const DEFAULT_EMPTY_RECT = new Rect(0, 0, 0, 0);

export interface PageContext {
  position: 'top' | 'bottom';
  pageNumber: number;
  totalPages: number;
}

interface TextOptions {
  fontOptions?: FontOptions;
  link?: string;
  textOptions?: Parameters<jsPDF['text']>[3];
}

export abstract class Component {
  protected _doc?: jsPDF;

  protected bounds: Rect = DEFAULT_EMPTY_RECT;

  protected pageContext?: PageContext;

  protected _pdfDoc?: PDFDocument;
  private renderDebug = false;

  public setDocument(document: PDFDocument): void {
    if (document.pdfDoc) {
      this._pdfDoc = document;
      this._doc = document.pdfDoc;
    }
  }

  public setBounds(bounds: Rect) {
    this.bounds = bounds;
  }

  public setPageContext(context: PageContext): void {
    this.pageContext = context;
  }

  /**
   * When set to true, it draws and outline around the bounds region
   * to allow for a visual reference
   **/
  public setDebug(debug: boolean) {
    this.renderDebug = debug;
  }

  /**
   * Evaluate is called before the actual rendering takes place.
   * It is used to understand the size of the component for layouting
   * purposes before actually drawing them.
   *
   * The main concern of this function is laying out along a horizontal axis.
   * If a component does not fit into the bounding rectangle,
   *
   *
   * Wrapping may be optional, the wrapping behavior i
   * @returns
   *   - boolean indicating the fit
   *   - number indicating the actually required vertical space
   *   - partial component that fits into the bounding rect (undefined if all of it fits)
   *   - partial component that does not fit into the bounding rect (undefined if all of it fits)
   **/
  public evaluate(bounds: Rect): [boolean, number, Component?, Component?] {
    this._pdfDoc?.reset();
    this.bounds = bounds;

    return [false, 0];
  }

  public render(): void {
    if (this.bounds === DEFAULT_EMPTY_RECT) {
      throw new Error('Called render before setting rendering bounds.');
    }
    this._pdfDoc?.reset();
    this.drawDebug();
  }

  /**
   * This is a wrapper function around the jsPDF#getTextDimensions.
   * Unfortunately the the documented types provided by the jsPDF library seem to be wrong
   * as supplying the font argument as a string results in runtime errors, suggesting the font
   * was not resvoled properly.
   *
   * Instead, this helper function handles the temporary application of font styles outside the jsPDF
   * library.
   *
   * Also, providing the different parameters (custom font, custom font size) seems to work
   * does not produce a reliable behavior when dealing with multiline strings on the document
   *
   **/
  protected getTextDimensions(
    text: string,
    options?: FontOptions & Parameters<jsPDF['getTextDimensions']>[1]
  ) {
    if (!this._doc) {
      throw new Error('Called before setting pdf document to component');
    }

    let resetFn;
    if (options?.fontFamily || options?.fontSize || options?.font) {
      const tempStyles: FontOptions = {
        fontFamily:
          options.font ||
          options.fontFamily ||
          options.fontFamily ||
          this._doc.getFont().fontName,
        fontSize: options.fontSize || this._doc.getFontSize(),
      };
      resetFn = this.temporaryFontStyle(tempStyles);
    }

    const dimensions = this._doc.getTextDimensions(
      text,
      options?.maxWidth ? { maxWidth: options.maxWidth } : undefined
    );

    if (resetFn) {
      resetFn();
    }

    return dimensions;
  }

  protected getLineHeight(fontFormat?: FontOptions) {
    const _doc = this.assertDoc();
    let resetFontStyle;
    if (fontFormat) {
      resetFontStyle = this.temporaryFontStyle(fontFormat);
    }
    const height = _doc.getFontSize() / _doc.getLineHeightFactor();

    if (resetFontStyle) {
      resetFontStyle();
    }

    return height;
  }

  protected getStringWidth(content: string) {
    const doc = this.assertDoc();

    return doc.getTextWidth(content);
  }

  protected temporaryFontStyle(fontFormat: FontOptions) {
    if (!this._doc) {
      throw new Error('Called before setting pdf document to component');
    }
    const previousFont = this._doc.getFont();
    const previousFontSize = this._doc.getFontSize();

    const resetClosure = () => {
      if (!this._doc) {
        throw new Error(
          'Reset closure has been called, but jsPDF document is undefined at component scope'
        );
      }
      this._doc.setFont(
        previousFont.fontName,
        previousFont.fontStyle || 'normal'
      );
      this._doc?.setFontSize(previousFontSize);
    };

    if (fontFormat.fontSize) {
      this._doc.setFontSize(fontFormat.fontSize);
    }

    if (fontFormat.fontFamily) {
      this._doc.setFont(
        fontFormat.fontFamily,
        fontFormat.fontStyle || 'normal'
      );
    }

    return resetClosure;
  }

  /**
   * Draw a piece of text to the PDF page while dealing with some of the oddities with the coorodinates
   *
   * @param x coordinate of the top left corner
   * @param y coordinate of the top left corner
   * @param options options to specifiy the formatting of the text
   **/
  protected text(
    x: number,
    y: number,
    text: string | string[],
    options?: TextOptions
  ) {
    if (!this._doc) {
      throw new Error('component.text() missing reference document');
    }
    let resetStyles;

    if (options?.fontOptions) {
      resetStyles = this.temporaryFontStyle(options.fontOptions);
    }
    let textHeight = 0;
    if (Array.isArray(text)) {
      // TODO: find way to reliably get the height of a multiline text
      return;
    } else {
      textHeight = this._doc.getTextDimensions(text).h;
    }
    if (options?.link) {
      this._doc.textWithLink(text, x, y + textHeight, { url: options?.link });
    } else {
      this._doc.text(text, x, y + textHeight, options?.textOptions);
    }

    if (resetStyles) {
      resetStyles();
    }
  }

  /**
   * Helper method to draw an image to the page.
   * The scaling behaviour differs based on the supplied arguments
   *
   * NOTE: if both the width and the height parameters are undefined, the image will be drawn in its original dimensions
   *
   * @param imageData - raw image data as defined by jsPDF
   * @param x starting coordinate
   * @param y starting coordinate
   * @param width the width of the image. If this argument is undefined, the image is scaled to the expected height while retaining the original images aspect ratio
   * @param height the height of the image. If this argument is undefined, the image is caled to the expected with while retaining the original image aspect ratio
   *
   * @throws This function can only be called in the generate scope. If it is called before the jsPDF document context is set, the the function will throw an error
   **/
  protected image(
    imageData: Parameters<jsPDF['getImageProperties']>[0],
    x: number,
    y: number,
    width?: number,
    height?: number
  ) {
    const pdf = this.assertDoc();
    const [imageWidth, imageHeight] = this.scaleImage(imageData, width, height);
    pdf.addImage(imageData, x, y, imageWidth!, imageHeight!);
  }

  protected scaleImage(
    imageData: Parameters<jsPDF['getImageProperties']>[0],
    width?: number,
    height?: number
  ): [number, number] {
    const pdf = this.assertDoc();

    const imageProperties = pdf.getImageProperties(imageData);
    let imageWidth: number;
    let imageHeight: number;

    if (width && height) {
      imageWidth = width;
      imageHeight = height;
    } else if (!width && !height) {
      imageWidth = imageProperties.width;
      imageHeight = imageProperties.height;
    } else if (width && !height) {
      imageWidth = width;
      imageHeight = imageProperties.height / (imageProperties.width / width);
    } else if (!width && height) {
      imageHeight = height;
      imageWidth = imageProperties.width / (imageProperties.height / height);
    }

    return [imageWidth!, imageHeight!];
  }

  protected hline(y: number, color?: string) {
    const pdf = this.assertDoc();
    let resetColor: string | undefined;
    if (color) {
      resetColor = pdf.getDrawColor();
      pdf.setDrawColor(color);
    }
    pdf.line(0, y, pdf.internal.pageSize.getWidth(), y);
    if (resetColor) {
      pdf.setDrawColor(resetColor);
    }
  }

  protected assertPageContext(): PageContext {
    if (!this.pageContext) {
      throw new Error(
        'Page context is not avaiable. The page context property is only set on repeat elements like headers or footers'
      );
    }

    return this.pageContext;
  }

  protected assertDoc(): jsPDF {
    if (!this._doc) {
      throw new Error(
        'jsPDF object missing from component scope. This function was called outside the #generate scope of the document'
      );
    }

    return this._doc;
  }
  /**
   * Using the jsPDF#getTextDimensions() currently only works reliably for single line strings.
   * In instances where strings span over mutliple lines of text, the value caulculated is unreliable.
   *
   * This method of calculating is basedo n a pull request to the jsPDF library that is currently waiting
   * for review
   * @see https://github.com/parallax/jsPDF/pull/3814
   *
   * @param text the text to calculate the height of
   * @param maxWidth the maximum with the text is allowed to take. Splitting is done using the doc.splitTextToSize option
   * @param fontFormat the optional font format that should be applied. If undefined, the current document format is used
   **/
  protected getMultilineTextHeight(
    text: string,
    maxWidth: number,
    fontFormat?: FontOptions
  ) {
    const doc = this.assertDoc();
    let resetFn;

    if (fontFormat) {
      resetFn = this.temporaryFontStyle(fontFormat);
    }

    const splitUpText = doc.splitTextToSize(text, maxWidth) as string[];
    const lineHeightFacotor = doc.getLineHeightFactor();
    const fontSize = doc.getFontSize();

    const multilineTextHeight =
      (splitUpText.length * fontSize * lineHeightFacotor -
        fontSize * (lineHeightFacotor - 1)) /
      doc.internal.scaleFactor;

    if (resetFn) {
      resetFn();
    }

    return multilineTextHeight;
  }

  /**
   * Placing the text always requires the top left coordinate, making alignment
   * of the text to the right hard.
   **/
  protected alignRight(x: number, text: string, font?: FontOptions): number {
    return x - this.getTextDimensions(text, font).w;
  }

  protected vcenter(
    y: number,
    height: number,
    text: string,
    maxWidth: number,
    fontOptions?: FontOptions
  ) {
    const textHeight = this.getMultilineTextHeight(text, maxWidth, fontOptions);

    return y + height / 2 - textHeight / 2;
  }

  private drawDebug() {
    if (this.bounds === DEFAULT_EMPTY_RECT) {
      throw new Error('Called render before setting rendering bounds.');
    }
    if (this.renderDebug) {
      this._doc?.rect(
        this.bounds.x,
        this.bounds.y,
        this.bounds.width,
        this.bounds.height
      );
    }
  }
}
