import { DomSanitizer } from '@angular/platform-browser';

import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;

  beforeEach(() => {
    const mockSanitizer = {
      bypassSecurityTrustHtml: jest.fn((html) => html),
    } as unknown as DomSanitizer;
    pipe = new SafeHtmlPipe(mockSanitizer);
  });

  it('should sanitize the given html string', () => {
    expect(pipe.transform('test')).toEqual('test');
    expect(pipe['sanitizer'].bypassSecurityTrustHtml).toHaveBeenCalledWith(
      'test'
    );
  });
});
