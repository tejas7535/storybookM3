import { CustomLoadingOverlayComponent } from '../../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { RadioButtonCellRenderComponent } from '../../table/radio-button-cell-render/radio-button-cell-render.component';
import { CalculationsStatusBarComponent } from '../../table/status-bar/calculations-status-bar';

export const FRAMEWORK_COMPONENTS = {
  calculationsStatusBarComponent: CalculationsStatusBarComponent,
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
};

export const FRAMEWORK_COMPONENTS_MINIFIED = {
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
  radioButtonCellRenderComponent: RadioButtonCellRenderComponent,
};
