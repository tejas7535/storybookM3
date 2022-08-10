import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { INoRowsOverlayParams } from 'ag-grid-community';

import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from './custom-no-rows-overlay.component';

describe('CustomNoRowsOverlayComponent', () => {
  let spectator: Spectator<CustomNoRowsOverlayComponent>;
  let component: CustomNoRowsOverlayComponent;

  const createComponent = createComponentFactory(CustomNoRowsOverlayComponent);

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should define params', () => {
      const params: NoRowsParams = {
        getMessage: () => 'no rows',
      };

      component.agInit(
        params as unknown as INoRowsOverlayParams & NoRowsParams
      );

      expect(component.params).toEqual(params);
    });
  });
});
