import { Pipe, PipeTransform } from '@angular/core';

import { PageMetaStatus } from '@caeonline/dynamic-forms';

@Pipe({
  name: 'mmPageBefore',
})
export class PageBeforePipe implements PipeTransform {
  transform(
    pageId: string,
    maxPageId: string,
    pages: PageMetaStatus[]
  ): boolean {
    return (
      pages.findIndex((page) => page.id === pageId) <=
      pages.findIndex((page) => page.id === maxPageId)
    );
  }
}
