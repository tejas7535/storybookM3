import { LubricantType } from '@lsa/shared/constants';
import { mockLubricantForm } from '@lsa/testing/mocks/form.mock';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';

import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LubricantComponent } from './lubricant.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('LubricantComponent', () => {
  let spectator: Spectator<LubricantComponent>;
  let component: LubricantComponent;

  const createComponent = createComponentFactory({
    component: LubricantComponent,
    imports: [SelectModule, provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.setInput('lubricantForm', mockLubricantForm);
    spectator.setInput('greases', [
      {
        id: 'ARCANOL_MULTI2',
        title: 'Arcanol MULTI2',
      },
    ]);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have a select for the lubricant type', () => {
    spectator.detectChanges();
    const select = spectator.query('schaeffler-select');
    expect(select).toBeTruthy();
  });

  describe('when non arcanol type is selected', () => {
    beforeAll(() => {
      component.lubricantForm.patchValue({
        lubricantType: LubricantType.Grease,
      });
      spectator.detectChanges();
    });

    it('should not have a select for the lubricant type', () => {
      spectator.detectChanges();
      const select = spectator.query('schaeffler-select');
      expect(select).toBeFalsy();
    });
  });

  describe('when filter', () => {
    it('should filter options', () => {
      expect(
        component.filterFn({ title: 'Arcanol', id: 'someId' }, 'ArcaN')
      ).toBe(true);
    });

    it('should return true if value not provided', () => {
      expect(
        component.filterFn({ title: 'Arcanol', id: 'someId' }, undefined)
      ).toBe(true);
    });
  });
});
