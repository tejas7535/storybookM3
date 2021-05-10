import { CustomLoadingOverlayComponent } from '../../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CompareViewButtonComponent } from '../../table/custom-status-bar/compare-view-button/compare-view-button.component';
import { LoadBomButtonComponent } from '../../table/custom-status-bar/load-bom-button/load-bom-button.component';

export const FRAMEWORK_COMPONENTS = {
  loadBomButtonComponent: LoadBomButtonComponent,
  compareViewButtonComponent: CompareViewButtonComponent,
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
};

export const FRAMEWORK_COMPONENTS_MINIFIED = {
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
};
