import { PageMetaStatus } from '@caeonline/dynamic-forms';

import { PageBeforePipe } from './page-before.pipe';

describe('PageBeforePipe', () => {
  let pipe: PageBeforePipe;

  beforeEach(() => {
    pipe = new PageBeforePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return true when pageId is smaller or identical to maxPageId', () => {
      const pageId = 'mockPageID';
      const maxPageId = 'mockMaxPageId';
      const pages = [
        { id: 'firstPageId' },
        { id: 'mockPageId' },
        { id: 'secondPageId' },
        { id: 'mockMaxPageId' },
      ] as PageMetaStatus[];

      const result = pipe.transform(pageId, maxPageId, pages);

      expect(result).toEqual(true);
    });
  });
});
