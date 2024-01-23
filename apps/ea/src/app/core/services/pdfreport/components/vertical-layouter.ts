import jsPDF from 'jspdf'; // eslint-disable-line import/no-extraneous-dependencies

import {
  LayoutBlock,
  LayoutBlocks,
  LayoutConstraints,
  LayoutEvaluationResult,
  renderers,
} from './render-types';

// Simple wrapper class for readabiliy
class Queue<T> {
  private readonly store: T[] = [];

  push(val: T) {
    this.store.push(val);
  }

  pop(): undefined | T {
    return this.store.shift();
  }

  prepend(el: T) {
    this.store.unshift(el);
  }

  peek(): undefined | T {
    return this.store[0];
  }

  isEmpty() {
    return this.store.length === 0;
  }
}

export class VerticalLayout {
  private readonly layoutComponents: Queue<LayoutBlock<any>> = new Queue();

  private readonly documentConstraints: LayoutConstraints = {
    offsetTop: 0,
    pageMargin: 21,
    offsetBottom: 0,
  };
  private yPos = 0;
  constructor(
    private readonly doc: jsPDF,
    constraints?: Partial<LayoutConstraints>
  ) {
    if (constraints) {
      Object.assign(this.documentConstraints, constraints);
    }

    this.yPos = Math.max(
      this.documentConstraints.pageMargin,
      this.documentConstraints.offsetTop
    );
  }

  add<T>(
    type: LayoutBlocks,
    data: T,
    options?: { header?: string; props?: { [key: string]: string } }
  ): VerticalLayout {
    const block: LayoutBlock<T> = {
      data,
      type,
      dryRun: true,
      constraints: this.documentConstraints,
      yStart: -1,
      heading: options?.header,
      blockProps: options?.props,
    };
    if (block.data && block.data !== undefined) {
      this.layoutComponents.push(block);
    }

    return this;
  }

  public loop() {
    let dryRunCounter = 0;
    let layoutCounter = 0;
    while (!this.layoutComponents.isEmpty()) {
      layoutCounter += 1;
      const block = this.layoutComponents.pop();
      if (Array.isArray(block.data) && block.data.length === 0) {
        continue;
      }
      const renderer = renderers[block.type];
      if (!renderer) {
        throw new Error(
          `Renderer for block type ${block.type} is not available`
        );
      }

      if (block.dryRun) {
        dryRunCounter += 1;
        if (dryRunCounter > 1) {
          this.reset();
        }

        block.yStart = this.yPos;
        block.maxHeight =
          this.doc.internal.pageSize.getHeight() -
          this.documentConstraints.offsetBottom -
          this.yPos;
        const evaluation: LayoutEvaluationResult<any>[] = renderer(
          this.doc,
          block
        );

        if (evaluation.length === 0 || evaluation.length > 2) {
          console.error(block);
          throw new Error(`Unexpected return length. Got ${evaluation.length}`);
        }
        const fitted = evaluation.find((ev) => ev.canFit);
        const overflow = evaluation.find((ev) => !ev.canFit);

        const regen = (dryRun: boolean, data: any) => ({
          ...block,
          data,
          dryRun,
        });
        if (overflow) {
          this.layoutComponents.prepend(regen(true, overflow.data));
        }
        if (fitted) {
          this.layoutComponents.prepend(regen(false, fitted.data));
        }
      } else {
        dryRunCounter = 0;
        const calculated = renderer(this.doc, block);
        if (calculated.length !== 1) {
          throw new Error(
            'unexpected length for draw evaluation. Expected one evaluation result'
          );
        }
        if (!calculated[0].canFit) {
          throw new Error(
            'layout error, expected item to fit since it has been calculated before'
          );
        }
        this.yPos = calculated[0].verticalShift + 12;
      }
      if (layoutCounter > 100) {
        break;
      }
    }

    return this.doc;
  }

  private reset() {
    this.doc.addPage();
    this.yPos = Math.max(
      this.documentConstraints.offsetTop,
      this.documentConstraints.pageMargin
    );
  }
}
