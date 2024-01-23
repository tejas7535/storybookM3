import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AppRoutePath } from '@ea/app-route-path.enum';
import { CalculationContainerComponent } from '@ea/calculation/calculation-container/calculation-container.component';
import { SettingsFacade } from '@ea/core/store';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoDecimalPipe } from '@ngneat/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { Breadcrumb, BreadcrumbsModule } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'ea-calculation-view',
  templateUrl: './calculation-view.component.html',
  standalone: true,
  imports: [CalculationContainerComponent, BreadcrumbsModule, PushPipe, NgIf],
  providers: [TranslocoDecimalPipe],
})
export class CalculationViewComponent {
  public readonly isStandalone$ = this.settingsFacade.isStandalone$;

  public breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject(
    this.getBreadcrumbs()
  );

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly settingsFacade: SettingsFacade
  ) {}

  private getBreadcrumbs(): Breadcrumb[] {
    return [
      {
        label: this.translocoService.translate('breadcrumbs.landingPage'),
        url: AppRoutePath.HomePath,
      },
      {
        label: this.translocoService.translate('breadcrumbs.calculation'),
      },
    ];
  }
}
