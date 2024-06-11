import { MmHostMappingPipe } from './mm-host-mapping.pipe';

describe('MmHostMappingPipe', () => {
  it('create an instance', () => {
    const pipe = new MmHostMappingPipe();
    expect(pipe).toBeTruthy();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should map incorrect host', () => {
    const pipe = new MmHostMappingPipe();
    const value = pipe.transform(
      'http://10.0.1.22:80/MountingManager/Images/1.jpg'
    );

    expect(value).toContain('.schaeffler.com/mounting/api/Images/1.jpg');
  });
  test('should not transform other resources', () => {
    const pipe = new MmHostMappingPipe();
    const value = pipe.transform('http://12.0.1.22:80/someurl/Images/1.jpg');
    expect(value).toBe('http://12.0.1.22:80/someurl/Images/1.jpg');
  });
});
