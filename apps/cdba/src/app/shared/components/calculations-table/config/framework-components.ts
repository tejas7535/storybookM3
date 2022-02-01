import { CustomLoadingOverlayComponent } from '../../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CompareCalculationsButtonComponent } from '../../table/custom-status-bar/compare-calculations-button/compare-calculations-button.component';
import { LoadBomButtonComponent } from '../../table/custom-status-bar/load-bom-button/load-bom-button.component';

export const FRAMEWORK_COMPONENTS = {
  loadBomButtonComponent: LoadBomButtonComponent,
  compareCalculationsButtonComponent: CompareCalculationsButtonComponent,
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
};

export const FRAMEWORK_COMPONENTS_MINIFIED = {
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
};
