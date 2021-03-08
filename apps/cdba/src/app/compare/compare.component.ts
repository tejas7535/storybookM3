import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { Tab } from '../shared/interfaces';
import { CompareRoutePath } from './compare-route-path.enum';

@Component({
  selector: 'cdba-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent {
  public tabs: Tab[];

  constructor(private readonly translocoService: TranslocoService) {
    this.tabs = [
      {
        label$: this.translateKey('tabs.details'),
        link: CompareRoutePath.DetailsPath,
      },
      {
        label$: this.translateKey('tabs.billOfMaterial'),
        link: CompareRoutePath.BomPath,
      },
    ];
  }

  translateKey(key: string): Observable<string> {
    return this.translocoService.selectTranslate(key, {}, 'compare');
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
