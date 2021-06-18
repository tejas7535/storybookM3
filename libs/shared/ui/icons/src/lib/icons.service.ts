import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  public constructor(private readonly matIconRegistry: MatIconRegistry) {}

  public registerFontClassAlias(): void {
    this.matIconRegistry.registerFontClassAlias('schaeffler-icons', 'icon');
  }
}
