import { Injectable } from '@angular/core';

import { combineLatest, map } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class HomeCardsService {
  public readonly sustainabilityCard$ = this.translocoService
    .selectTranslate('homePage.sustainabilityCard.action.url')
    .pipe(
      map((sustainabilityCardUrl) => ({
        mainTitle: 'homePage.sustainabilityCard.title',
        actionTitle: 'homePage.sustainabilityCard.action.title',
        action: this.getExternalLinkAction(sustainabilityCardUrl),
      }))
    );

  public readonly homeCards$ = combineLatest([
    this.translocoService.selectTranslate(
      'homePage.cards.greaseApp.externalLink'
    ),
    this.translocoService.selectTranslate(
      'homePage.cards.mountingManager.externalLink'
    ),
    this.translocoService.selectTranslate(
      'homePage.cards.catalog.externalLink'
    ),
    this.translocoService.selectTranslate(
      'homePage.cards.contact.externalLink'
    ),
  ]).pipe(
    map(([greaseAppLink, mountingManagerLink, catalogLink, contactLink]) => [
      {
        mainTitle: 'homePage.cards.greaseApp.title.main',
        subTitle: 'homePage.cards.poweredBy',
        svgIcon: 'grease_app',
        action: this.getExternalLinkAction(greaseAppLink),
      },
      {
        mainTitle: 'homePage.cards.mountingManager.title.main',
        subTitle: 'homePage.cards.poweredBy',
        svgIcon: 'mounting_manager',
        action: this.getExternalLinkAction(mountingManagerLink),
      },
      {
        mainTitle: 'homePage.cards.catalog.title.main',
        imagePath: this.getCardImageUrl('catalog.jpg'),
        action: this.getExternalLinkAction(catalogLink),
      },
      {
        mainTitle: 'homePage.cards.contact.title.main',
        imagePath: this.getCardImageUrl('contact.jpg'),
        action: this.getExternalLinkAction(contactLink),
      },
    ])
  );

  private readonly imagePathBase = `${environment.assetsPath}/images/homepage`;
  constructor(private readonly translocoService: TranslocoService) {}

  private getCardImageUrl(imagePath: string): string {
    return `${this.imagePathBase}/${imagePath}`;
  }

  private getExternalLinkAction(externalLink: string): () => void {
    return (): void => {
      window.open(externalLink, '_blank');
    };
  }
}
