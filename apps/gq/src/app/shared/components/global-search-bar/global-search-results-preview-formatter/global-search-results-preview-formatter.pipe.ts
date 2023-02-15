import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Keyboard } from '../../../models';
import { IdValue } from '../../../models/search';
import { MaterialNumberService } from '../../../services/material-number/material-number.service';

@Pipe({
  name: 'globalSearchResultsPreviewFormatter',
})
export class GlobalSearchResultsPreviewFormatterPipe implements PipeTransform {
  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly materialNumberService: MaterialNumberService
  ) {}

  transform(idValue: IdValue, searchVal: string): string {
    if (idValue?.id?.startsWith(searchVal)) {
      return this.sanitize(
        this.formatMaterialDescription(idValue.id, searchVal.length)
      );
    } else if (idValue?.value?.startsWith(searchVal)) {
      return this.sanitize(
        this.formatMaterialNumber(idValue.value, searchVal.length)
      );
    } else {
      return Keyboard.DASH;
    }
  }

  private formatMaterialNumber(
    materialNumber: string,
    highlightedCharCount: number
  ) {
    const formattedMaterialNumber =
      this.materialNumberService.formatStringAsMaterialNumber(materialNumber);

    let additionalCount = 0;
    if (highlightedCharCount > 9 && highlightedCharCount <= 13) {
      additionalCount = 1;
    } else if (highlightedCharCount > 13) {
      additionalCount = 2;
    }

    const highlightedPart = formattedMaterialNumber.slice(
      0,
      highlightedCharCount + additionalCount
    );

    const rest = formattedMaterialNumber.slice(
      highlightedCharCount + additionalCount,
      formattedMaterialNumber.length
    );

    return this.buildHighlightedTextHTML(highlightedPart, rest);
  }

  private formatMaterialDescription(
    materialDescription: string,
    highlightedCharCount: number
  ) {
    const highlightedPart = materialDescription.slice(0, highlightedCharCount);
    const rest = materialDescription.slice(
      highlightedCharCount,
      materialDescription.length
    );

    return this.buildHighlightedTextHTML(highlightedPart, rest);
  }

  private buildHighlightedTextHTML(highlightedPart: string, rest: string) {
    return `<span class="text-high-emphasis font-bold">${highlightedPart}</span><span class="text-medium-emphasis">${rest}</span>`;
  }

  sanitize(htmlString: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlString);
  }
}
