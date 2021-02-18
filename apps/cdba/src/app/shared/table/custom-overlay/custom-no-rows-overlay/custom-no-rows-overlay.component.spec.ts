import { createComponentFactory, Spectator } from '@ngneat/spectator';

import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from './custom-no-rows-overlay.component';

describe('CustomNoRowsOverlayComponent', () => {
  let spectator: Spectator<CustomNoRowsOverlayComponent>;
  let component: CustomNoRowsOverlayComponent;

  const createComponent = createComponentFactory({
    component: CustomNoRowsOverlayComponent,
    declarations: [CustomNoRowsOverlayComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should define params', () => {
      const params: NoRowsParams = {
        getMessage: () => 'no rows',
      };

      component.agInit(params);

      expect(component.params).toEqual(params);
    });
  });
});
