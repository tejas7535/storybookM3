import { Injectable } from '@angular/core';

import { HeadingFonts, SectionHeading } from '../../components';
import { PdfCardComponent } from '../../components/pdf-card/pdf-card';
import {
  ListStyle,
  StringListComponent,
} from '../../components/string-list/string-list';
import { Component, FontOptions } from '../../core';

const CARD_DEFAULT_VALUES = {
  CARD_BORDER_RADIUS: 4,
  CARD_PADDING: 2,
  CARD_MARGIN: 4,
  CARD_BORDER_WIDTH: 0.5,
};

@Injectable({
  providedIn: 'root',
})
export class PdfComponentFactory {
  public createCard(
    components: Component[],
    options: {
      borderRadius?: number;
      backgroundColor?: string;
      padding?: number;
      margin?: number;
      borderColor?: string;
      borderWidth?: number;
      keepTogether?: boolean;
    } = {}
  ): PdfCardComponent {
    const cardOptions = {
      borderRadius: CARD_DEFAULT_VALUES.CARD_BORDER_RADIUS,
      padding: CARD_DEFAULT_VALUES.CARD_PADDING,
      margin: CARD_DEFAULT_VALUES.CARD_MARGIN,
      borderWidth: CARD_DEFAULT_VALUES.CARD_BORDER_WIDTH,
      ...options,
    };

    return new PdfCardComponent({
      content: components,
      ...cardOptions,
    });
  }

  /**
   * Convenience method to create a card with a single component
   */
  public createSingleComponentCard(
    content: Component,
    options: {
      borderRadius?: number;
      backgroundColor?: string;
      padding?: number;
      margin?: number;
      borderColor?: string;
      borderWidth?: number;
      keepTogether?: boolean;
    } = {}
  ): PdfCardComponent {
    return this.createCard([content], options);
  }

  public createStringList(
    items: string[],
    listStyle: ListStyle,
    options: {
      backgroundColor?: string;
      fontOptions?: FontOptions;
    } = {}
  ): Component {
    return new StringListComponent({
      items: items.filter((item) => !!item),
      listStyle,
      fontOptions: options.fontOptions ?? {
        fontFamily: 'Noto',
        fontSize: 10,
      },
      padding: 2,
      margin: 2,
    });
  }

  public createSectionHeading(text: string): Component {
    return new SectionHeading({
      font: HeadingFonts['main'],
      text,
      underline: false,
    });
  }

  public createSectionSubHeading(text: string): Component {
    return new SectionHeading({
      font: HeadingFonts['medium'],
      text,
      underline: false,
    });
  }
}
