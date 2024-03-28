import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { GreenSteelCellRendererComponent } from './green-steel-cell-renderer.component';

jest.mock('../edit-cell-renderer/edit-cell-renderer.component', () => ({
  EditCellRendererComponent: jest.fn(),
}));

describe('GreenSteelCellRendererComponent', () => {
  let component: GreenSteelCellRendererComponent;
  let spectator: Spectator<GreenSteelCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: GreenSteelCellRendererComponent,
    imports: [MockPipe(PushPipe), provideTranslocoTestingModule({ en })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
