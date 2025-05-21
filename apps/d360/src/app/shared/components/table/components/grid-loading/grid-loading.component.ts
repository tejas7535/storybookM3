import { Component } from '@angular/core';

import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-enterprise';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

/**
 * The grid loading component.
 *
 * @export
 * @class GridLoadingComponent
 * @implements {ILoadingOverlayAngularComp}
 */
@Component({
  template: `
    <schaeffler-loading-spinner [useBearingLoadingSpinner]="true" />

    @if (params.loadingMessage) {
      <div aria-live="polite" aria-atomic="true" class="mt-6">
        {{ params.loadingMessage }}
      </div>
    }
  `,
  imports: [LoadingSpinnerModule],
})
export class GridLoadingComponent implements ILoadingOverlayAngularComp {
  /**
   * The parameters for this method.
   *
   * @type {(ILoadingOverlayParams & { loadingMessage: string })}
   * @memberof GridLoadingComponent
   */
  public params!: ILoadingOverlayParams & { loadingMessage: string };

  /** @inheritdoc */
  public agInit(
    params: ILoadingOverlayParams & { loadingMessage: string }
  ): void {
    this.params = params;
  }
}
