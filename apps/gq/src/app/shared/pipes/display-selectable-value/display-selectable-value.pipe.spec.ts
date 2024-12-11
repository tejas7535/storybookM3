import { DisplaySelectableValuePipe } from './display-selectable-value.pipe';

describe('DisplaySelectableValuePipe', () => {
  let pipe: DisplaySelectableValuePipe;
  beforeEach(() => {
    pipe = new DisplaySelectableValuePipe();
    jest.resetAllMocks();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
