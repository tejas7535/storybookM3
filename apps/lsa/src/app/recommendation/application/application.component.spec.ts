import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { mockApplicationForm } from '@lsa/testing/mocks/form.mock';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ApplicationComponent } from './application.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('ApplicationComponent', () => {
  let spectator: Spectator<ApplicationComponent>;
  let component: ApplicationComponent;

  const createComponent = createComponentFactory({
    component: ApplicationComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.setInput('applicationForm', mockApplicationForm);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have lsa-radio button component', () => {
    spectator.detectChanges();
    const radioButton = spectator.query(RadioButtonGroupComponent);
    expect(radioButton).toBeTruthy();
    expect(radioButton.options).toMatchSnapshot();
  });
});
