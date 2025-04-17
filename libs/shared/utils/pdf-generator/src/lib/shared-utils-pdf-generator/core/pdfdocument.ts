import { jsPDF, jsPDFOptions } from 'jspdf';

import { FontConfig } from '../angular/font-resolver.service';
import { Component } from './component';
import { ControlCommands, Margins } from './format';
import { Rect } from './rect';

export class PDFDocument {
  public readonly pdfDoc: jsPDF = new jsPDF();
  private readonly defaultLineWith = this.pdfDoc.getLineWidth();
  private readonly defaultFontSize = this.pdfDoc.getFontSize();
  private readonly defaultFillColor = this.pdfDoc.getFillColor();

  private defaultFont = this.pdfDoc.getFont().fontName;
  private debugMode = false;

  private readonly components: (Component | ControlCommands)[] = [];
  private header?: Component;
  private footer?: Component;

  private componentSpacing = 0;

  /**
   * Holds the Y Position for the next layout element.
   * The y position is inclusiveo f the page margins
   *
   **/
  private currentVpos = 0;

  private readonly staticElementHeight = {
    header: 0,
    footer: 0,
  };

  private pageMargins: Margins = {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  };

  public constructor(options?: jsPDFOptions) {
    this.pdfDoc = new jsPDF(options);
  }

  /**
   * Add the document footer
   *
   * @throws Error when the addFooter method has previously been called on the same document
   * @param footer footer component
   * @returns self
   **/
  public addFooter(footer: Component) {
    if (this.footer) {
      throw new Error('Footer component already exists');
    }
    this.footer = footer;
    this.footer.setDocument(this);
    const [fits, vshift] = this.footer.evaluate(this.getPageRect());
    if (!fits) {
      throw new Error(
        'Expected footer to fit in fulle page rect, but returned false for fit'
      );
    }
    this.staticElementHeight.footer = vshift;

    return this;
  }

  /**
   * Add a font style to the PDFs VFS
   *
   * @param fontConfig the font config object, for example as resolved from the font-resolver.service.ts
   *
   * @see FontResolverService
   * @see https://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#addFont
   **/
  public addFont(...configs: FontConfig[]): PDFDocument {
    configs.forEach((config) => {
      if (!config.fontData) {
        console.warn(
          `Loading font ${config.fontName} into file ${config.fileName} was attempted, but is missing font data. Have you loaded the font correctly?`
        );

        return;
      }
      this.pdfDoc.addFileToVFS(`${config.fileName}`, config.fontData);
      this.pdfDoc.addFont(
        `${config.fileName}`,
        config.fontName,
        config.fontStyle
      );
    });

    return this;
  }

  /**
   * Set the default font for the document
   **/
  public setFont(font: string) {
    this.defaultFont = font;

    return this;
  }

  /**
   * Add the document header
   *
   * @throws Error when the addHeader method has previously been called on the same document
   * @param header header component
   * @returns self
   **/
  public addHeader(header: Component) {
    if (this.header) {
      throw new Error('Header component already exists');
    }
    this.header = header;
    this.header.setDocument(this);
    const [fits, vshift] = this.header.evaluate(this.getPageRect());
    if (!fits) {
      throw new Error(
        'Expected header to fit in fulle page rect, but returned false for fit'
      );
    }
    this.staticElementHeight.header = vshift;
    this.currentVpos =
      this.pageMargins.top +
      this.staticElementHeight.header +
      this.componentSpacing;

    return this;
  }

  public setPageMargin(margins: Margins) {
    this.pageMargins = margins;
    this.currentVpos = this.pageMargins.top;

    return this;
  }

  public addComponent(...components: (Component | ControlCommands)[]) {
    this.components.push(...components);

    return this;
  }

  /**
   * Get the directional page insets
   * NOTE: insets include the static spaces allocated to the header and footer
   *
   * @param direction to query the direction for
   *
   * @returns inset for a given direction
   **/
  public insets(direction: keyof Margins): number {
    if (direction === 'top') {
      return this.pageMargins.top + this.staticElementHeight.header;
    } else if (direction === 'bottom') {
      return this.pageMargins.bottom + this.staticElementHeight.footer;
    }

    return this.pageMargins[direction];
  }

  public generate(): void {
    let consequtiveNonRenderLayoutRuns = 0;
    while (this.components.length > 0) {
      this.reset();

      const nextBlock = this.components.shift() as Component;
      if (typeof nextBlock === 'string') {
        const controlSequence = ControlCommands[nextBlock];

        if (controlSequence === ControlCommands.PageBreak) {
          this.addPageBreak();
        }
        continue;
      }

      const component = nextBlock as Component;
      component.setDocument(this);
      component.setDebug(this.debugMode);

      const pageBounds = this.getPageRect();
      const [fits, vshift, fittingPart, remainingPart] =
        component.evaluate(pageBounds);
      if (fits) {
        pageBounds.height = vshift;
        component.setBounds(pageBounds);
        component.render();

        this.vshift(vshift);
        continue;
      } else {
        consequtiveNonRenderLayoutRuns += 1;
      }

      if (remainingPart) {
        this.prepend(remainingPart);
      }

      if (fittingPart) {
        this.prepend(fittingPart);
      }

      if (consequtiveNonRenderLayoutRuns > 3) {
        this.addPageBreak();
        consequtiveNonRenderLayoutRuns = 0;
      } else if (consequtiveNonRenderLayoutRuns >= 8) {
        console.error(
          'Layouting logic stuck in endless loop with more than 3 iterations without a componenten drawn. Check the page break behaviour of your defined components to ensure they can page break gracefully',
          this.debugMode ? this.components : ''
        );
        break;
      }
    }

    this.drawStaticElements();
  }

  public save(filename: string) {
    return this.pdfDoc?.save(filename);
  }

  public getPageMargins() {
    return this.pageMargins;
  }

  public setDebug(debugMode: boolean) {
    this.debugMode = debugMode;

    return this;
  }

  /**
   * Reset to the default styles
   **/
  public reset() {
    this.pdfDoc.setFontSize(this.defaultFontSize);
    this.pdfDoc.setFillColor(this.defaultFillColor);
    this.pdfDoc.setLineWidth(this.defaultLineWith);
    this.pdfDoc.setFont(this.defaultFont, 'regular');
    this.pdfDoc.setDrawColor('#000');
  }

  public setComponentSpacing(space: number) {
    this.componentSpacing = space;
    this.currentVpos = this.insets('top') + this.componentSpacing;

    return this;
  }

  private drawStaticElements() {
    const headerRect = new Rect(
      this.pageMargins.left,
      this.pageMargins.top,
      this.staticElementHeight.header,
      this.pdfDoc.internal.pageSize.getWidth() -
        this.pageMargins.left -
        this.pageMargins.right
    );

    const footerRect = new Rect(
      this.pageMargins.left,
      this.pdfDoc.internal.pageSize.getHeight() -
        this.pageMargins.bottom -
        this.staticElementHeight.footer,
      this.staticElementHeight.footer,
      this.pdfDoc.internal.pageSize.getWidth() -
        this.pageMargins.left -
        this.pageMargins.right
    );

    if (this.header) {
      this.header.setDocument(this);
      this.header.setBounds(headerRect);
      this.header.setDebug(this.debugMode);
    }

    if (this.footer) {
      this.footer.setDocument(this);
      this.footer.setBounds(footerRect);
      this.footer.setDebug(this.debugMode);
    }
    const numberOfPages = this.pdfDoc.getNumberOfPages();
    for (let i = 1; i <= numberOfPages; i += 1) {
      this.reset();
      this.pdfDoc.setPage(i);
      if (this.header) {
        this.header.setPageContext({
          position: 'top',
          pageNumber: i,
          totalPages: numberOfPages,
        });
        this.header.render();
      }
      this.reset();
      if (this.footer) {
        this.footer.setPageContext({
          position: 'bottom',
          pageNumber: i,
          totalPages: numberOfPages,
        });
        this.footer.render();
      }
    }
  }

  private prepend(component: Component) {
    this.components.unshift(component);
  }

  private getPageRect(): Rect {
    const pageH = this.pdfDoc.internal.pageSize.getHeight();
    const pageW = this.pdfDoc.internal.pageSize.getWidth();

    return new Rect(
      this.pageMargins.left,
      this.currentVpos,
      pageH - this.currentVpos - this.insets('bottom'),
      pageW - (this.insets('left') + this.insets('right'))
    );
  }

  private vshift(amount: number) {
    this.currentVpos += amount + this.componentSpacing;
    if (!this.validVPosBounds()) {
      this.addPageBreak();
    }
  }

  /**
   * Add a a page break manually, regardless of where the current layout stops
   **/
  private addPageBreak() {
    this.pdfDoc.addPage();
    this.currentVpos = this.insets('top') + this.componentSpacing;

    return this;
  }
  /**
   * Check if the vertical cursor position currently set is given the documents constrains
   *
   * @returns if the current value of the vertical position is valid given the pages constrains
   **/
  private validVPosBounds(): boolean {
    const pageHeight = this.pdfDoc.internal.pageSize.getHeight();

    return this.currentVpos < pageHeight - this.insets('bottom');
  }
}
