import {
  config,
  getBearingAndLSPFormat,
  reformatLSPkey,
} from './polar-options.echart';

describe('config', () => {
  it('the data array of the angle axis should be 123 for each bearing', () => {
    expect((config.angleAxis as any).data.length).toBe(123);
  });

  it('the value should be reflected in the string', () => {
    expect(
      getBearingAndLSPFormat([
        { name: 'device1', value: 123.2 },
        { name: 'device12', value: 1235.2 },
      ])
    ).toContain('123.20');
  });
  it('should convert lspkey to extract the id', () => {
    expect(reformatLSPkey('lsp10Strain')).toBe('10');
    expect(reformatLSPkey(undefined as any)).toBe('');
  });
});
