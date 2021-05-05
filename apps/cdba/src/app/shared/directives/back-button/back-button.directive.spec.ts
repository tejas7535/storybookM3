import { RouterTestingModule } from '@angular/router/testing';

import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { BackButtonDirective } from './back-button.directive';

describe('BackButtonDirective', () => {
  let spectator: SpectatorDirective<BackButtonDirective>;
  let instance: BackButtonDirective;

  const createDirective = createDirectiveFactory({
    directive: BackButtonDirective,
    imports: [RouterTestingModule],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div cdbaBackButton>Testing Back Button</div>`
    );

    instance = spectator.directive;
  });

  it('should get the instance', () => {
    expect(instance).toBeDefined();
  });

  it('should trigger navigateBack', () => {
    instance.navigateBack = jest.fn();

    spectator.dispatchMouseEvent(spectator.element, 'click');

    expect(instance.navigateBack).toHaveBeenCalled();
  });

  describe('navigateBack', () => {
    it('should locate back', () => {
      const spy = jest.spyOn(instance['location'], 'back');

      instance.navigateBack();

      expect(spy).toHaveBeenCalled();
    });
  });
});
