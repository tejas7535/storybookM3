import { HelperService } from '../../services/helper-service/helper-service.service';
import { PercentagePipe } from './percentage.pipe';

describe('PercentagePipe', () => {
  test('create an instance', () => {
    const pipe = new PercentagePipe();
    expect(pipe).toBeTruthy();
  });
  test('should call HelperService', () => {
    const pipe = new PercentagePipe();
    HelperService.transformPercentage = jest.fn();

    pipe.transform(10);
    expect(HelperService.transformPercentage).toHaveBeenCalledTimes(1);
    expect(HelperService.transformPercentage).toHaveBeenCalledWith(10);
  });
});
