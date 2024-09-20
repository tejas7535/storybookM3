import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockDirective } from 'ng-mocks';

import { DialogHeaderComponent } from './dialog-header.component';

describe('DialogHeaderComponent', () => {
  let component: DialogHeaderComponent;
  let spectator: Spectator<DialogHeaderComponent>;

  const createComponent = createComponentFactory({
    component: DialogHeaderComponent,
    imports: [MatIconModule, MockDirective(DragDialogDirective)],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
