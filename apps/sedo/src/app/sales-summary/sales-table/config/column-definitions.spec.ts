import { IGNORE_FLAG_DESCRIPTIONS } from '../constants/ignore-flag-descriptions.const';
import {
  dateFormatter,
  ignoreFlagFormatter,
  warningFormatter,
} from './column-definitions';

describe('dateFormatter', () => {
  it('should render Date', () => {
    const data = {
      value: '2020-11-24T07:46:32.446388',
    };
    const result = dateFormatter(data);

    const expected = new Date(data.value).toLocaleDateString();
    expect(result).toEqual(expected);
  });
  it('should render empty Date', () => {
    const data = {};
    const result = dateFormatter(data);
    expect(result).toEqual('');
  });
});

describe('warningFormatter', () => {
  it('should return "Warning"', () => {
    const data = {
      value: 'true',
    };

    const result = warningFormatter(data);

    const expected = 'Warning';
    expect(result).toEqual(expected);
  });

  it('should return "No Warning"', () => {
    const data = {
      value: 'false',
    };

    const result = warningFormatter(data);

    const expected = 'No Warning';
    expect(result).toEqual(expected);
  });
});

describe('ignoreFlagFormatter', () => {
  it('should return ignore flag description', () => {
    const data = {
      value: 0,
    };

    const result = ignoreFlagFormatter(data);

    const expected = IGNORE_FLAG_DESCRIPTIONS[0];
    expect(result).toEqual(expected);
  });

  it('should return no description warning', () => {
    const data = {
      value: 9999,
    };

    const result = ignoreFlagFormatter(data);

    const expected = `No ignore flag description for ${data.value}`;
    expect(result).toEqual(expected);
  });
});
