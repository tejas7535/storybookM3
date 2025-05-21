import { Injectable } from '@angular/core';

import { TwoColumnPageLayout } from '@mm/shared/components/pdf/layout/two-columns-page-layout';

import { Component } from '@schaeffler/pdf-generator';

export interface TwoColumnLayoutOptions {
  columnGap?: number;
  leftColumnWidth?: number;
}

interface ComponentPair {
  left?: Component;
  right?: Component;
}

@Injectable()
export class PdfLayoutService {
  /**
   * Creates multiple TwoColumnPageLayout components with even distribution
   * of components across left and right columns.
   * Each TwoColumnPageLayout will contain one component on the left and one on the right.
   *
   * @param components Array of components to be arranged in two columns
   * @param options Layout options
   * @returns Array of TwoColumnPageLayout components
   */
  createTwoColumnLayouts(
    components: Component[],
    options?: TwoColumnLayoutOptions
  ): TwoColumnPageLayout[] {
    const pairs = this.pairComponentsEvenly(components);

    return pairs.map((pair) =>
      this.createLayout(
        pair.left,
        pair.right,
        options?.columnGap ?? 6,
        options?.leftColumnWidth ?? 0.49
      )
    );
  }

  /**
   * Creates multiple TwoColumnPageLayout components with specified left and right components.
   * The number of layouts created will be equal to the maximum length of either array.
   *
   * @param leftComponents Array of components for the left column
   * @param rightComponents Array of components for the right column
   * @param options Layout options
   * @returns Array of TwoColumnPageLayout components
   */
  createTwoColumnLayoutsWithComponents(
    leftComponents: Component[],
    rightComponents: Component[],
    options?: TwoColumnLayoutOptions
  ): TwoColumnPageLayout[] {
    const maxLength = Math.max(leftComponents.length, rightComponents.length);
    const layouts: TwoColumnPageLayout[] = [];

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < maxLength; i += 1) {
      layouts.push(
        this.createLayout(
          leftComponents[i] ?? undefined,
          rightComponents[i] ?? undefined,
          options?.columnGap ?? 6,
          options?.leftColumnWidth ?? 0.49
        )
      );
    }

    return layouts;
  }

  private createLayout(
    leftComponent?: Component,
    rightComponent?: Component,
    columnGap: number = 6,
    leftColumnWidth: number = 0.49
  ): TwoColumnPageLayout {
    return new TwoColumnPageLayout({
      leftComponent,
      rightComponent,
      columnGap,
      leftColumnWidth,
    });
  }

  private pairComponentsEvenly(components: Component[]): ComponentPair[] {
    const pairs: ComponentPair[] = [];

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < components.length; i += 2) {
      pairs.push({
        left: components[i],
        right: components[i + 1] ?? undefined,
      });
    }

    return pairs;
  }
}
