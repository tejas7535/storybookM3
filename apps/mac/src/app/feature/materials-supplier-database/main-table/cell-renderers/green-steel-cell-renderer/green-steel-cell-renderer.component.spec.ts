import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';

import * as en from '../../../../../../assets/i18n/en.json';
import { GreenSteelCellRendererComponent } from './green-steel-cell-renderer.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('GreenSteelCellRendererComponent', () => {
  let component: GreenSteelCellRendererComponent;
  let spectator: Spectator<GreenSteelCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: GreenSteelCellRendererComponent,
    imports: [MockPipe(PushPipe), provideTranslocoTestingModule({ en })],
    providers: [MockProvider(MsdDialogService), provideMockStore({})],
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
