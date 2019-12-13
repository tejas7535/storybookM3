import { SelectControlOption } from './select-control-option.model';

describe('SelectControlOption', () => {
  it('constructor should work properly', () => {
    const value = 10;
    const name = 'name';

    let controlOption = new SelectControlOption(value, name);

    expect(controlOption.name).toEqual(name);
    expect(controlOption.value).toEqual(value);
    expect(controlOption.disabled).toBeFalsy();

    controlOption = new SelectControlOption(value, name, true);

    expect(controlOption.name).toEqual(name);
    expect(controlOption.value).toEqual(value);
    expect(controlOption.disabled).toBeTruthy();
  });
});
