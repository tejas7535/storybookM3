import { getAssetsPath } from './assets-path-resolver.helper';
import { EMAPlatform } from './ema-platform';

describe('Assets Path Resolver Helper', () => {
  it('should return capacitor assets path for iOS', () => {
    const result = getAssetsPath('default/path', EMAPlatform.IOS);
    expect(result).toBe('capacitor://localhost/assets');
  });

  it('should return https assets path for Android', () => {
    const result = getAssetsPath('default/path', EMAPlatform.ANDROID);
    expect(result).toBe('https://localhost/assets');
  });

  it('should return default path for other platforms', () => {
    const result = getAssetsPath('default/path');
    expect(result).toBe('default/path');
  });
});
