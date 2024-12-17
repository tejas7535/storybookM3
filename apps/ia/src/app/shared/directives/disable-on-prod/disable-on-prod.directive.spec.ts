import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import * as utils from '../../guards/is-feature-enabled';
import { DisableOnProdDirective } from './disable-on-prod.directive';

jest.mock('../../guards/is-feature-enabled', () => ({
  ...jest.requireActual('../../guards/is-feature-enabled'),
  isFeatureEnabled: jest.fn(),
}));

describe('Directive: DisableOnProdDirective', () => {
  let spectator: SpectatorDirective<DisableOnProdDirective>;
  let directive: DisableOnProdDirective;
  const createDirective = createDirectiveFactory({
    directive: DisableOnProdDirective,
  });

  beforeEach(() => {
    spectator = createDirective('<div *disableOnProd></div>');
    directive = spectator.directive;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  test('should create view if not prod mode', () => {
    jest.spyOn(directive['viewContainer'], 'createEmbeddedView');
    jest.spyOn(utils, 'isFeatureEnabled').mockReturnValue(true);

    directive.ngOnInit();
    expect(directive['viewContainer'].createEmbeddedView).toHaveBeenCalled();
  });

  test('should clear view if feature is enabled', () => {
    jest.spyOn(directive['viewContainer'], 'clear');
    jest.spyOn(utils, 'isFeatureEnabled').mockReturnValue(false);

    directive.ngOnInit();
    expect(directive['viewContainer'].clear).toHaveBeenCalled();
  });
});
