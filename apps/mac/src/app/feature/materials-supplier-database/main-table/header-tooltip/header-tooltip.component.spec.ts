import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { TooltipParams } from '../table-config';
import { HeaderTooltipComponent } from './header-tooltip.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('HeaderTooltipComponent', () => {
  let component: HeaderTooltipComponent;
  let spectator: Spectator<HeaderTooltipComponent>;

  const mockParams = { value: 'columnTooltip' } as TooltipParams<any, string>;

  const createComponent = createComponentFactory({
    component: HeaderTooltipComponent,
    imports: [provideTranslocoTestingModule({ en })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.tooltipValue = undefined;
  });

  describe('agInit', () => {
    test('should translate tooltip value', () => {
      component.agInit({ ...mockParams, translate: true });

      expect(translate).toHaveBeenCalledWith(
        `materialsSupplierDatabase.mainTable.tooltip.${mockParams.value}`
      );
      expect(component.tooltipValue).toBe('translate it');
    });

    test('should not translate tooltip value', () => {
      jest.resetAllMocks();

      component.agInit({ ...mockParams, translate: false });

      expect(translate).not.toHaveBeenCalled();
      expect(component.tooltipValue).toBe(mockParams.value);
    });
  });
});
