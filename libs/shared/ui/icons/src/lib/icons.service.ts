import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  public constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {}

  public registerSchaefflerIconSet(): void {
    const setUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      '../assets/schaeffler-icon-set.svg'
    );
    this.matIconRegistry.addSvgIconSet(setUrl);
  }
}
