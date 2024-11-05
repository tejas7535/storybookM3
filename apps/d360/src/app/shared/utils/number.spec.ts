import { Component } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { strictlyParseInteger, strictlyParseLocalFloat } from './number';
import { ValidationHelper } from './validation/validation-helper';

@Component({
  selector: 'app-dummy',
  standalone: true,
  template: '',
})
class DummyComponent {}

describe('numbers', () => {
  let spectator: Spectator<DummyComponent>;

  const createComponent = createComponentFactory({
    component: DummyComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    ValidationHelper.localeService = spectator.query(TranslocoLocaleService);
  });

  test.each`
    input        | isValid
    ${'1'}       | ${true}
    ${'1200'}    | ${true}
    ${'1.2'}     | ${false}
    ${'1.2'}     | ${false}
    ${'1,1'}     | ${false}
    ${'1.200,5'} | ${false}
    ${'1,200.5'} | ${false}
    ${'-5'}      | ${false}
    ${'1,1,3'}   | ${false}
    ${'1.1.3'}   | ${false}
    ${'eins'}    | ${false}
    ${'0b101'}   | ${false}
    ${'0o13'}    | ${false}
    ${'0x0A'}    | ${false}
  `('strictlyParseInt parses $input correctly', ({ input, isValid }) => {
    const result = strictlyParseInteger(input);
    const resultValid = !Number.isNaN(result);
    expect(resultValid).toBe(isValid);
  });

  test.each`
    input        | decimalSeparator | isValid
    ${'1'}       | ${'COMMA'}       | ${true}
    ${'1200'}    | ${'COMMA'}       | ${true}
    ${'1.2'}     | ${'COMMA'}       | ${false}
    ${'1.2'}     | ${'PERIOD'}      | ${true}
    ${'1,1'}     | ${'COMMA'}       | ${true}
    ${'1,1'}     | ${'PERIOD'}      | ${false}
    ${'1.200,5'} | ${'COMMA'}       | ${true}
    ${'1.200,5'} | ${'PERIOD'}      | ${false}
    ${'1,200.5'} | ${'COMMA'}       | ${false}
    ${'1,200.5'} | ${'PERIOD'}      | ${true}
    ${'-5'}      | ${'COMMA'}       | ${false}
    ${'1,1,3'}   | ${'COMMA'}       | ${false}
    ${'1.1.3'}   | ${'COMMA'}       | ${false}
    ${'eins'}    | ${'COMMA'}       | ${false}
    ${'0b101'}   | ${'COMMA'}       | ${false}
    ${'0o13'}    | ${'COMMA'}       | ${false}
    ${'0x0A'}    | ${'COMMA'}       | ${false}
  `(
    'strictlyParseLocalFloat parses $input with locale $decimalSeparator correctly',
    ({ input, decimalSeparator, isValid }) => {
      const result = strictlyParseLocalFloat(input, decimalSeparator);
      const resultValid = !Number.isNaN(result);
      expect(resultValid).toBe(isValid);
    }
  );
});
