import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { translate } from '@jsverse/transloco';

@Injectable()
export class TranslatedPageTitleStrategyService extends TitleStrategy {
  private readonly title = inject(Title);

  /**
   * Updates the title based on the given RouterStateSnapshot.
   *
   * @param {RouterStateSnapshot} snapshot - The current state of the router.
   * @memberof TranslatedPageTitleStrategyService
   */
  public updateTitle(snapshot: RouterStateSnapshot): void {
    // Build a custom title from the snapshot or use an empty string if none exists.
    const customTitle: string = this.buildTitle(snapshot) || '';

    // Get the titles array from the snapshot's root firstChild data, which might be undefined.
    const titles: string[] | undefined = snapshot.root.firstChild.data?.titles;

    /**
     * Set the title based on the following priority:
     * 1. Translated titles in the titles array (if it exists and has length).
     * 2. Custom title from buildTitle function call.
     * 3. Translation of 'header.title' if none of the above exist.
     */
    this.title.setTitle(
      // Check if titles array exists, is an array, and has a length greater than 0.
      titles && Array.isArray(titles) && titles.length > 0
        ? titles.map((title) => translate(title)).join(' | ')
        : customTitle || translate('header.title')
    );
  }
}
