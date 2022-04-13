import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { VIEW_QUOTATION_MOCK } from '../../../../../testing/mocks';
import { GqIdComponent } from './gq-id.component';

describe('GqIdComponent', () => {
  let component: GqIdComponent;
  let spectator: Spectator<GqIdComponent>;

  const createComponent = createComponentFactory({
    component: GqIdComponent,
    imports: [RouterTestingModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set itemId and gqPositionId', () => {
      const params = {
        valueFormatted: 'GQ123',
        data: VIEW_QUOTATION_MOCK,
      };

      component.agInit(params as any);

      expect(component.valueFormatted).toEqual(params.valueFormatted);
      expect(component.quotation).toEqual(params.data);
    });
  });

  describe('navigate', () => {
    test('should navigate', () => {
      const event = { preventDefault: jest.fn() };
      component['router'].navigate = jest.fn();
      component.quotation = {
        customerIdentifiers: { customerId: '1', salesOrg: '267' },
      } as any;

      component.navigate(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component['router'].navigate).toHaveBeenCalledTimes(1);
    });
  });
});
