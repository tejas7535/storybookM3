import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { IdValue } from '../../../models/search';

@Pipe({
  name: 'globalSearchResultsPreviewFormatter',
})
export class GlobalSearchResultsPreviewFormatterPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(idValue: IdValue, searchVal: string): string {
    const value = idValue?.id?.startsWith(searchVal)
      ? idValue.id
      : idValue.value;

    return this.sanitize(
      this.highlightFirstNCharacters(value, searchVal.length)
    );
  }

  highlightFirstNCharacters(str: string, highlightedCharCount: number) {
    const highlightedPart = str.slice(0, highlightedCharCount);
    const rest = str.slice(highlightedCharCount, str.length);

    return `<span class="text-high-emphasis font-bold">${highlightedPart}</span><span class="text-medium-emphasis">${rest}</span>`;
  }

  sanitize(htmlString: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlString);
  }
}
