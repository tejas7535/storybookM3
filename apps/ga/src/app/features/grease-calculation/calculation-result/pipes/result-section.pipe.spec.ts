import { greaseResultMock } from '@ga/testing/mocks';

import { ResultSectionPipe } from './result-section.pipe';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key: string) => key),
}));

describe('ResultSectionPipe', () => {
  let pipe: ResultSectionPipe;

  beforeEach(() => {
    pipe = new ResultSectionPipe();
  });

  it('should tranform the result matching the snapshot', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should transform the result', () => {
      const result = pipe.transform(greaseResultMock);

      expect(result).toMatchSnapshot();
    });
  });

  describe('splitBadgeText', () => {
    it.each([
      [
        '<span>text</span>',
        { badgeText: 'text', badgeSecondaryText: undefined },
      ],
      [
        '<span>text</span> <span>secondary</span>',
        { badgeText: 'text', badgeSecondaryText: 'secondary' },
      ],
      [
        '<span>text</span><br><span class="something">secondary</span>',
        { badgeText: 'text', badgeSecondaryText: 'secondary' },
      ],
      ['text', { badgeText: 'text', badgeSecondaryText: undefined }],
      ['', { badgeText: undefined, badgeSecondaryText: undefined }],
    ])('should split badge text "%s" into %j', (input, expected) => {
      const result = pipe['splitBadgeText'](input);
      expect(result).toEqual(expected);
    });
  });
});
