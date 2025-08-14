import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ModalFooterComponent } from './modal-footer.component';

describe('ModalFooterComponent', () => {
  let component: ModalFooterComponent;
  let spectator: Spectator<ModalFooterComponent>;

  const createComponent = createComponentFactory({
    component: ModalFooterComponent,

    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
