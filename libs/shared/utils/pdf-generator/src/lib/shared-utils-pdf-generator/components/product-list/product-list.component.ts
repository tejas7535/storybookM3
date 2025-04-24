/*  eslint max-lines: 0  */

import { Component } from '../../core';
import { Rect } from '../../core/rect';
import { mergeDefaults } from '../../core/util';
import {
  DefaultStyles,
  PrecomputedLayout,
  Product,
  ProductGroup,
  Props,
  Style,
} from './data';

export class ProductList extends Component {
  private readonly data: Props['data'];
  private readonly style: Style;
  private readonly labels: Props['labels'];
  private readonly allowGroupBreaks: boolean = false;
  private readonly props: Props;
  private readonly showPriceColumnsSetting: boolean;

  private computedLayout: PrecomputedLayout[] = [];

  constructor(props: Props) {
    super();
    const {
      data,
      style,
      labels,
      allowGroupBreaks,
      showAvailabilityAndPriceWhenAvailabile,
    } = props;
    this.props = props;
    this.data = data;
    this.style = mergeDefaults(style, DefaultStyles);
    this.style.spacing = mergeDefaults(style?.spacing, DefaultStyles.spacing);
    this.labels = labels;
    this.allowGroupBreaks = allowGroupBreaks || true;
    this.showPriceColumnsSetting =
      showAvailabilityAndPriceWhenAvailabile || false;
    if (
      this.showPriceColumnsSetting &&
      (!this.labels.availability || !this.labels.price)
    ) {
      throw new Error('Labels for price and availability are not complete');
    }
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);

    const headerSpacing =
      this.style.spacing.header?.top ||
      0 + this.style.spacing.header!.bottom ||
      0;
    const headerTextHeight =
      this.getTextDimensions('Mockheader', this.style.headerFont).h +
      headerSpacing;

    const hasImages = this.data
      .flatMap((dataset) =>
        dataset.products.some((product) => !!product.imageUrl)
      )
      .includes(true);

    let availabilityColumnWidth = 0;
    let priceColumnWidth = 0;
    if (this.showPriceColumnsSetting) {
      [availabilityColumnWidth, priceColumnWidth] =
        this.getSpaceRequirementsForAvailability();
    }

    const width =
      this.bounds.width -
      (hasImages ? this.style.imageWidth + this.style.gap : 0);
    const quantityColumnWidth = this.getTextDimensions(
      this.labels.quantity,
      this.style.labelFont
    ).w;

    // const coreLayoutSpace = width - quantityColumnWidth - this.style.gap;

    const longestProductId = Math.max(
      ...this.data
        .flatMap((data) => data.products)
        .map((product) => `${product.id || 0}`.length)
    );
    const longestIdWidth = this.getTextDimensions(`${longestProductId}`).w;

    const idLabelWidth = this.getTextDimensions(this.labels.id).w;

    const productIdColumnWidth = Math.max(longestIdWidth, idLabelWidth);

    const productTitleColumnWidth =
      width -
      quantityColumnWidth -
      productIdColumnWidth -
      availabilityColumnWidth -
      priceColumnWidth -
      this.style.gap;

    const rowStartCoord =
      this.bounds.x + (this.style.spacing.productRow?.left || 0);

    // Layout
    // Image (if existent) | Product Designation + desc | Availability (if present) | Price (if present) | ID | Qty
    const imageX = rowStartCoord;
    const productDetailsX =
      rowStartCoord + (hasImages ? this.style.imageWidth + this.style.gap : 0);
    const productDetailsWidth = productTitleColumnWidth;

    const availabilityColumnX = productDetailsX + productDetailsWidth;
    const priceColumnX =
      availabilityColumnX +
      availabilityColumnWidth +
      (priceColumnWidth > 0 ? this.style.gap / 2 : 0);
    const productIdX =
      productDetailsX +
      productDetailsWidth +
      availabilityColumnWidth +
      priceColumnWidth +
      (priceColumnWidth > 0 ? this.style.gap : 0);
    const productIdWidth = productIdColumnWidth;

    const quantityColumnX =
      this.bounds.BottomRight.x -
      (this.style.spacing.productRow?.right || 0) -
      quantityColumnWidth;
    const precomputed: PrecomputedLayout[] = this.data.map((group) => {
      const header = group.title;
      const rows = group.products.map((product) => {
        const designationHeight = this.getMultilineTextHeight(
          product.designation,
          productTitleColumnWidth,
          this.style.designationFont
        );
        const descriptionHeight = product.description
          ? this.getMultilineTextHeight(
              product.description,
              productTitleColumnWidth,
              this.style.labelFont
            )
          : 0;

        let imageHeight = 0;
        if (product.imageUrl) {
          try {
            imageHeight = this.scaleImage(
              product.imageUrl,
              this.style.imageWidth
            )[1];
          } catch (error) {
            console.error(error);
          }
        }

        return {
          height: Math.max(
            designationHeight +
              descriptionHeight +
              (this.style.spacing.designationMargin || 0),
            imageHeight
          ),
          data: product,
        };
      });

      return {
        header: {
          title: header,
          price: group.price,
        },
        cell: {
          imageX,
          productDetailsX,
          productDetailsWidth,
          productIdX,
          productIdWidth,
          availabilityColumnX,
          availabilityColumnWidth,
          priceColumnWidth,
          priceColumnX,
          quantityColumnX,
          quantityColumnWidth,
        },
        rows,
      };
    });

    this.computedLayout = precomputed;
    const totalHeight =
      precomputed.length * (headerTextHeight + headerSpacing) +
      precomputed
        .flatMap((group) => group.rows)
        .reduce(
          (accum, curr) =>
            accum +
            (curr.height +
              (this.style.spacing.productRow?.top || 0) +
              (this.style.spacing.productRow?.bottom || 0)),
          0
        );

    if (totalHeight <= this.bounds.height) {
      return [true, totalHeight];
    }
    const [fitting, overflow] = this.allowGroupBreaks
      ? this.breakContentsBreakGroups(headerTextHeight + headerSpacing)
      : this.breakContentsRetainGroups(headerTextHeight);

    const fittingComponent = new ProductList({ ...this.props, data: fitting });
    const overflowComponent = new ProductList({
      ...this.props,
      data: overflow,
    });

    return [false, bounds.height, fittingComponent, overflowComponent];
  }
  /* eslint-disable complexity */
  public override render(): void {
    super.render();

    const doc = this.assertDoc();

    let startY = this.bounds.y;
    const layout = this.computedLayout;

    const headerTextHeight = this.getMultilineTextHeight(
      'Mock header',
      999_999,
      { ...this.style.headerFont }
    );
    const headerSpacing =
      (this.style.spacing.header?.top || 0) +
      (this.style.spacing.header?.bottom || 0);

    for (const group of layout) {
      doc.setFillColor(this.style.headerBackground);
      doc.setTextColor(0, 0, 0);
      doc.rect(
        this.bounds.x,
        startY,
        this.bounds.width,
        headerTextHeight + headerSpacing,
        'F'
      );
      startY += this.style.spacing.header?.top || 0;

      this.text(
        this.bounds.x + (this.style.spacing.header?.left || 0),
        startY,
        group.header.title,
        { fontOptions: this.style.headerFont }
      );
      const quantityXCoord =
        this.alignRight(
          this.bounds.BottomRight.x,
          this.labels.quantity,
          this.style.headerFont
        ) - (this.style.spacing.header?.right || 0);
      this.text(quantityXCoord, startY, this.labels.quantity, {
        fontOptions: this.style.headerFont,
      });

      if (group.header.price && this.showPriceColumnsSetting) {
        const priceColX = group.cell.priceColumnX!;
        this.text(priceColX, startY, group.header.price, {
          fontOptions: this.style.headerFont,
        });
      }

      startY += (this.style.spacing.header?.bottom || 0) + headerTextHeight;
      for (const productRow of group.rows) {
        startY += this.style.spacing.productRow?.top || 0;
        const product = productRow.data;
        const verticalCenterline = startY + productRow.height / 2;

        if (product.imageUrl) {
          this.image(
            product.imageUrl,
            group.cell.imageX,
            startY,
            this.style.imageWidth
          );
        }

        const designationTextHeight = this.getMultilineTextHeight(
          product.designation,
          group.cell.productDetailsWidth,
          this.style.designationFont
        );

        this.text(group.cell.productDetailsX, startY, product.designation, {
          fontOptions: this.style.designationFont,
          textOptions: { maxWidth: group.cell.productDetailsWidth },
        });

        if (product.description) {
          this.text(
            group.cell.productDetailsX,
            startY +
              designationTextHeight +
              (this.style.spacing.designationMargin || 1),
            product.description,
            {
              fontOptions: this.style.labelFont,
              textOptions: { maxWidth: group.cell.productDetailsWidth },
            }
          );
        }
        if (product.id) {
          const textH = this.getTextDimensions('mock', this.style.labelFont).h;

          this.text(
            group.cell.productIdX,
            verticalCenterline - textH - this.style.verticalMargin,
            `${product.id}`,
            {
              fontOptions: this.style.labelFont,
              textOptions: { maxWidth: group.cell.productIdWidth },
            }
          );

          this.text(group.cell.productIdX, verticalCenterline, this.labels.id, {
            fontOptions: this.style.labelFont,
          });
        }

        if (
          product.price &&
          group.cell.priceColumnX &&
          group.cell.priceColumnWidth
        ) {
          const priceString = `${product.price} ${product.currency}`;
          this.drawPrice(
            group.cell.priceColumnX,
            verticalCenterline,
            group.cell.priceColumnWidth,
            priceString
          );
        }

        if (
          product.available !== undefined &&
          group.cell.availabilityColumnX &&
          group.cell.availabilityColumnWidth
        ) {
          this.drawAvailability(
            group.cell.availabilityColumnX,
            verticalCenterline,
            group.cell.availabilityColumnWidth,
            product.available
          );
        }

        if (product.quantity) {
          const qtyText = `${product.quantity}`;
          const qtyY = this.vcenter(
            startY,
            productRow.height,
            qtyText,
            group.cell.productIdWidth,
            this.style.labelFont
          );
          this.text(group.cell.quantityColumnX, qtyY, qtyText, {
            fontOptions: this.style.labelFont,
            textOptions: { maxWidth: group.cell.productIdWidth },
          });
        }
        startY +=
          productRow.height + (this.style.spacing.productRow?.bottom || 0);
      }
    }
    this.renderBorders(headerTextHeight + headerSpacing);
  }

  private drawAvailability(
    x: number,
    centerY: number,
    columnWidth: number,
    available: boolean
  ) {
    const doc = this.assertDoc();
    const RADIUS = 1.12;

    const text = available
      ? this.labels.availability!.inStock
      : this.labels.availability!.outOfStock;
    const textWidth = this.getTextDimensions(text, this.style.labelFont).w;
    doc.setFillColor(
      available
        ? this.style.avilabilityColors.inStock
        : this.style.avilabilityColors.outOfStock
    );

    doc.ellipse(x + columnWidth / 2, centerY - 2 * RADIUS, RADIUS, RADIUS, 'F');
    this.text(x + columnWidth / 2 - textWidth / 2, centerY, text, {
      fontOptions: this.style.labelFont,
    });
  }

  private drawPrice(
    x: number,
    centerY: number,
    columnWidth: number,
    price: string
  ) {
    const label = this.labels.price || 'missing label';
    const labelWidth = this.getTextDimensions(label, this.style.labelFont).w;
    this.text(x + columnWidth / 2 - labelWidth / 2, centerY, label, {
      fontOptions: this.style.labelFont,
    });
    const priceTextDimen = this.getTextDimensions(price, this.style.labelFont);

    const priceTextHeight = priceTextDimen.h;
    this.text(
      x + columnWidth / 2 - priceTextDimen.w / 2,
      centerY - priceTextHeight - this.style.verticalMargin,
      price,
      {
        fontOptions: this.style.priceFont,
      }
    );
  }

  private getSpaceRequirementsForAvailability() {
    const availabilityWidth = Math.max(
      this.getTextDimensions(
        this.labels.availability!.outOfStock,
        this.style.labelFont
      ).w,
      this.getTextDimensions(
        this.labels.availability!.inStock,
        this.style.labelFont
      ).w
    );

    const longestTotalString =
      this.data
        .filter((p) => p.price)
        .map((p) => p.price)
        .sort((a, b) => a!.length - b!.length)
        .pop() || '';
    const totalPriceHeaderWith = this.getTextDimensions(
      longestTotalString,
      this.style.headerFont
    ).w;

    const priceLabelWidth = this.getTextDimensions(
      this.labels.price!,
      this.style.labelFont
    ).w;

    const longestPrice =
      this.data
        .flatMap((d) => d.products)
        .map((p) => `${p.price} ${p.currency}`)
        .sort((a, b) => a!.length - b!.length)
        .pop() || '999,99 EUR';
    const priceColumnWidth = Math.max(
      priceLabelWidth,
      this.getTextDimensions(longestPrice, this.style.priceFont).w,
      totalPriceHeaderWith
    );

    return [availabilityWidth, priceColumnWidth];
  }

  private renderBorders(headerHeight: number) {
    const doc = this.assertDoc();
    let currentY = this.bounds.y;
    for (const group of this.computedLayout) {
      currentY += headerHeight;
      for (const [idx, product] of group.rows.entries()) {
        currentY +=
          product.height +
          (this.style.spacing.productRow?.bottom || 0) +
          (this.style.spacing.productRow?.top || 0);
        if (idx !== group.rows.length - 1) {
          doc.setDrawColor(this.style.headerBackground);
          doc.setLineWidth(0.75);
          doc.setLineCap('round');
          doc.line(
            this.bounds.x,
            currentY + 0.75 / 2,
            this.bounds.BottomRight.x,
            currentY + 0.75 / 2
          );
        }
      }
    }
  }

  /**
   * Splits the table data while retaining the groups completely
   * instead of dividing the groups up
   *
   * NOTE: This page break behaviour is likely to lead to issues since it will only work if the entirety
   * of the contents can fit onto a single page. Hence, it should only be used in instances where the content
   * is of known size (e.g a list of three featured products, etc)
   **/
  private breakContentsRetainGroups(defaultHeaderHeight: number) {
    let runningHeight = 0;
    const fittingData: ProductGroup[] = [];
    const overflowData: ProductGroup[] = [];
    for (const group of this.computedLayout) {
      runningHeight += defaultHeaderHeight;

      for (const product of group.rows) {
        runningHeight +=
          product.height +
          (this.style.spacing.productRow?.top || 0) +
          (this.style.spacing.productRow?.bottom || 0);
      }

      const groups: ProductGroup = {
        title: group.header.title,
        products: group.rows.flatMap((product) => product.data),
      };

      if (runningHeight <= this.bounds.height) {
        fittingData.push(groups);
      } else {
        overflowData.push(groups);
      }
    }

    return [fittingData, overflowData];
  }

  /**
   * Page break behavior for splitting up the product groups as well.
   * If a product group is split across pages, the same header for the group will be shown
   * on the next page.
   * This is the default behavior of the component
   **/
  private breakContentsBreakGroups(defaultHeaderHeight: number) {
    let runningHeight = 0;
    const fittingData: ProductGroup[] = [];
    const overflowData: ProductGroup[] = [];
    const productCellSpacings =
      (this.style.spacing.productRow?.top || 0) +
      (this.style.spacing.productRow?.bottom || 0);

    for (const group of this.computedLayout) {
      runningHeight += defaultHeaderHeight;
      if (runningHeight > this.bounds.height) {
        overflowData.push({
          title: group.header.title,
          products: group.rows.flatMap((product) => product.data),
        });
        continue;
      }
      const fittingSubset: Product[] = [];
      const overflowSubset: Product[] = [];

      for (const product of group.rows) {
        runningHeight += product.height + productCellSpacings;
        if (runningHeight <= this.bounds.height) {
          fittingSubset.push(product.data);
        } else {
          overflowSubset.push(product.data);
        }
      }

      if (fittingSubset.length > 0) {
        fittingData.push({
          title: group.header.title,
          products: fittingSubset,
        });
      }

      if (overflowSubset.length > 0) {
        overflowData.push({
          title: group.header.title,
          products: overflowSubset,
        });
      }
    }

    return [fittingData, overflowData];
  }
}
