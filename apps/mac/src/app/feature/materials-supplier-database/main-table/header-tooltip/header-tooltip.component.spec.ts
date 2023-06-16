import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ITooltipParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { HeaderTooltipComponent } from './header-tooltip.component';

describe('HeaderTooltipComponent', () => {
  let component: HeaderTooltipComponent;
  let spectator: Spectator<HeaderTooltipComponent>;

  const mockParams = { value: 'columnTooltip' } as ITooltipParams<any, string>;

  const createComponent = createComponentFactory({
    component: HeaderTooltipComponent,
    imports: [provideTranslocoTestingModule({ en })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.params = {} as ITooltipParams<any, string>;
  });

  describe('agInit', () => {
    it('should assign params', () => {
      component.agInit(mockParams);

      expect(component.params).toEqual(mockParams);
    });
  });
});
