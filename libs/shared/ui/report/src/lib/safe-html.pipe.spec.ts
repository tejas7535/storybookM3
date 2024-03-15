import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  let spectator: SpectatorPipe<SafeHtmlPipe>;

  const createPipe = createPipeFactory({
    pipe: SafeHtmlPipe,
    imports: [BrowserModule],
    providers: [
      {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustHtml: jest.fn((value) => `safe: ${value}`),
        },
      },
    ],
  });

  it('create an instance', () => {
    spectator = createPipe(`{{'htmlToAccept' | safeHtml}}`);

    expect(spectator.element.textContent).toBe(`safe: htmlToAccept`);
  });
});
