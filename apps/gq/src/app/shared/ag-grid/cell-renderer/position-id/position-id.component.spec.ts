import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { PositionIdComponent } from './position-id.component';

describe('PositionIdComponent', () => {
  let component: PositionIdComponent;
  let spectator: Spectator<PositionIdComponent>;

  const createComponent = createComponentFactory({
    component: PositionIdComponent,
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
        value: 10,
        data: {
          gqPositionId: '123',
        },
      };

      component.agInit(params as any);

      expect(component.gqPositionId).toEqual(params.data.gqPositionId);
      expect(component.itemId).toEqual(params.value);
    });
  });

  describe('navigate', () => {
    test('should navigate', () => {
      const event = { preventDefault: jest.fn() };
      component['router'].navigate = jest.fn();

      component.navigate(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component['router'].navigate).toHaveBeenCalledTimes(1);
    });
  });
});
