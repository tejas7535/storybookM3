import { CustomLoadingOverlayComponent } from '../../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { BomViewButtonComponent } from '../../table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CompareViewButtonComponent } from '../../table/custom-status-bar/compare-view-button/compare-view-button.component';

export const FRAMEWORK_COMPONENTS = {
  bomViewButtonComponent: BomViewButtonComponent,
  compareViewButtonComponent: CompareViewButtonComponent,
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
};

export const FRAMEWORK_COMPONENTS_MINIFIED = {
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
};
