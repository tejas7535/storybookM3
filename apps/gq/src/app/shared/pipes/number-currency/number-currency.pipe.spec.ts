import { HelperService } from '../../services/helper-service/helper-service.service';
import { NumberCurrencyPipe } from './number-currency.pipe';

describe('MarginDetailPipe', () => {
  test('create an instance', () => {
    const pipe = new NumberCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
  test('should transform number', () => {
    const pipe = new NumberCurrencyPipe();
    HelperService.transformMarginDetails = jest.fn();
    pipe.transform(10000, 'EUR');

    expect(HelperService.transformMarginDetails).toHaveBeenCalledTimes(1);
  });
});
