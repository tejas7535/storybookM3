import { OverlayContainer } from '@angular/cdk/overlay';

import { APP_ROOT } from './app.module';

// Based on https://stackoverflow.com/a/61074576
export class AppOverlayContainer extends OverlayContainer {
  protected _createContainer(): void {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('app-overlay-container');

    const element: Element | null = document.querySelector(APP_ROOT);
    if (element) {
      element.append(container);
      this._containerElement = container;
    }
  }
}
