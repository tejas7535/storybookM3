import { GqQuotationPipe } from './gq-quotation.pipe';

describe('GqQuotationPipe', () => {
  test('create an instance', () => {
    const pipe = new GqQuotationPipe();
    expect(pipe).toBeTruthy();
  });
  test('transform data', () => {
    const gqId = 31_002;

    const pipe = new GqQuotationPipe();
    const result = pipe.transform(gqId);

    expect(result).toEqual('GQ31002');
  });
});
