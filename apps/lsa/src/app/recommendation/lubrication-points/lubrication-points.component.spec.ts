import { mockLubricationPointsForm } from '@lsa/testing/mocks/form.mock';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LubricationPointsComponent } from './lubrication-points.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
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
