/* tslint:disable:no-unused-variable */

import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { FeatureToggleConfigService } from '../../services/feature-toggle/feature-toggle-config.service';
import { FeatureToggleDirective } from './feature-toggle.directive';

describe('Directive: FeatureToggle', () => {
  let spectator: SpectatorDirective<FeatureToggleDirective>;
  let directive: FeatureToggleDirective;
  const createDirective = createDirectiveFactory({
    directive: FeatureToggleDirective,
    providers: [
      {
        provide: FeatureToggleConfigService,
        useFactory: () => ({ isEnabled: jest.fn() }),
      },
    ],
  });

  beforeEach(() => {
    spectator = createDirective('<div *featureToggle="aFeature"></div>');
    directive = spectator.directive;
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  test('should create view if feature is enabled', () => {
    jest.spyOn(directive['configService'], 'isEnabled').mockReturnValue(true);
    jest.spyOn(directive['viewContainer'], 'createEmbeddedView');

    directive.ngOnInit();
    expect(directive['configService'].isEnabled).toHaveBeenCalled();
    expect(directive['viewContainer'].createEmbeddedView).toHaveBeenCalled();
  });

  test('should clear view if feature is enabled', () => {
    jest.spyOn(directive['configService'], 'isEnabled').mockReturnValue(false);
    jest.spyOn(directive['viewContainer'], 'clear');

    directive.ngOnInit();
    expect(directive['configService'].isEnabled).toHaveBeenCalled();
    expect(directive['viewContainer'].clear).toHaveBeenCalled();
  });
});
