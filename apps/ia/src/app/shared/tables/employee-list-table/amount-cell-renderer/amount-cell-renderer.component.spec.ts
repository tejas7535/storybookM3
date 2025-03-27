import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoService } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { AmountCellRendererComponent } from './amount-cell-renderer.component';

describe('AmountCellRendererComponent', () => {
  let component: AmountCellRendererComponent;
  let spectator: Spectator<AmountCellRendererComponent>;
  const translate = jest.fn();

  const createComponent = createComponentFactory({
    component: AmountCellRendererComponent,
    imports: [MatIconModule, MatTooltipModule],
    providers: [mockProvider(TranslocoService, { translate })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set data', () => {
      const params = {
        value: {
          count: 100,
          restrictedAccess: true,
        },
      } as unknown as ICellRendererParams;
      component.setTooltip = jest.fn();

      component.agInit(params);

      expect(component.amount).toEqual(100);
      expect(component.restrictedAccess).toBeTruthy();
      expect(component.setTooltip).toHaveBeenCalled();
    });
  });

  describe('setTooltip', () => {
    const mockTranslation = 'mock';

    beforeEach(() => {
      translate.mockReturnValue(mockTranslation);
    });

    test('should set default tooltip if user has enough rights', () => {
      component.restrictedAccess = false;

      component.setTooltip();

      expect(component.tooltip).toEqual(mockTranslation);
      expect(translate).toHaveBeenCalledWith('accessRights.showTeamMembers');
    });

    test('should set rights hint tooltip if user has not enough rights', () => {
      component.restrictedAccess = true;

      component.setTooltip();

      expect(component.tooltip).toEqual(mockTranslation);
      expect(translate).toHaveBeenCalledWith(
        'accessRights.showTeamMembersPartially'
      );
    });
  });
});
