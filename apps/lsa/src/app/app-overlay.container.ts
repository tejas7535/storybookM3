import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

import { APP_ROOT } from './app.module';

// Based on https://stackoverflow.com/a/61074576

@Injectable()
export class AppOverlayContainer extends OverlayContainer {
  private readonly appOverlayContainerClass = 'app-overlay-container';

  getContainerElement(): HTMLElement {
    this.createContainerIfNotExistOnThePage();

    if (!this._containerElement) {
      this._createContainer();
    }

    return this._containerElement;
  }

  protected _createContainer(): void {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add(this.appOverlayContainerClass);

    const element: Element | null = document.querySelector(APP_ROOT);
    if (element) {
      element.append(container);
      this._containerElement = container;
    }
  }

  /**
   * Creates container if not exist on the page,
   *  such edge case happens in embedded version, when web component is re-instated on the page
   */
  private createContainerIfNotExistOnThePage(): void {
    if (!this.getAppOverlayContainerByClass()) {
      this._createContainer();
    }
  }

  private getAppOverlayContainerByClass() {
    return document.querySelector(`.${this.appOverlayContainerClass}`);
  }
}
