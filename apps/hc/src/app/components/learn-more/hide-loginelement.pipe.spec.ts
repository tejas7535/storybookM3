import { HideLoginElementsPipe } from './hide-loginelement.pipe';

describe('LoginelementPipe', () => {
  let pipe: HideLoginElementsPipe;

  beforeEach(() => {
    pipe = new HideLoginElementsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should flatten a marked string for loggedin users', () => {
    expect(pipe.transform('(login)Test(/login)', false)).toBe('Test');
  });

  it('should remove marked string segments', () => {
    expect(pipe.transform('(login)Test(/login)', true)).toBe('');
  });
});
