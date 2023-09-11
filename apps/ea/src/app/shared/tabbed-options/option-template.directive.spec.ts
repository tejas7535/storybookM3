import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { OptionTemplateDirective } from './option-template.directive';

describe('OptionTemplateDirective', () => {
  let spectator: SpectatorDirective<OptionTemplateDirective>;
  let directive: OptionTemplateDirective;

  const createDirective = createDirectiveFactory({
    directive: OptionTemplateDirective,
  });

  beforeEach(() => {
    spectator = createDirective(
      `<ng-template optionTemplate="myname" label="mylabel">This is some content</ng-template>`
    );

    directive = spectator.directive;
  });

  it('should be created', () => {
    expect(directive).toBeTruthy();
  });

  it('should have a name and a label', () => {
    expect(directive.name).toEqual('myname');
    expect(directive.label).toEqual('mylabel');
  });
});
