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

  describe('getKappaBadgeColorClass', () => {
    it.each([
      ['0,0', 'bg-error-container text-error'],
      ['-1', 'bg-error-container text-error'],
      ['0.9', 'bg-error-container text-error'],
      ['4,1', 'bg-error-container text-error'],
      ['4,0', 'bg-success-container text-success'],
      ['1.5', 'bg-success-container text-success'],
      ['1,5', 'bg-success-container text-success'],
      ['3,9', 'bg-success-container text-success'],
    ])(
      'should return the right formatting class for %s the kappa badge',
      (input, expected) => {
        const result = pipe['getKappaBadgeColorClass'](input);
        expect(result).toEqual(expected);
      }
    );
  });
});
