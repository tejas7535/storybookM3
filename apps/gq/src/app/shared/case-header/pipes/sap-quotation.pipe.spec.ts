import { SapQuotationPipe } from './sap-quotation.pipe';

describe('SapQuotationPipe', () => {
  test('create an instance', () => {
    const pipe = new SapQuotationPipe();
    expect(pipe).toBeTruthy();
  });
  test('transform data', () => {
    const quotationNumber = '31002';

    const pipe = new SapQuotationPipe();
    const result = pipe.transform(quotationNumber);

    expect(result).toEqual(`| SAP${quotationNumber}`);
  });
});
