import { TranslocoModule } from '@jsverse/transloco';
import { mockLubricationPointsForm } from '@lsa/testing/mocks/form.mock';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LubricationPointsComponent } from './lubrication-points.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('LubricationPointsComponent', () => {
  let spectator: Spectator<LubricationPointsComponent>;
  let component: LubricationPointsComponent;

  const createComponent = createComponentFactory({
    component: LubricationPointsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    spectator.setInput('lubricationPointsForm', mockLubricationPointsForm);

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
