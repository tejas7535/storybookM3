import { Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AppRoutePath } from '@ea/app-route-path.enum';
import { CalculationContainerComponent } from '@ea/calculation/calculation-container/calculation-container.component';
import { ProductSelectionFacade, SettingsFacade } from '@ea/core/store/facades';
import { LegacyAppComponent } from '@ea/legacy-app/legacy-app.component';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoDecimalPipe } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { Breadcrumb, BreadcrumbsModule } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'ea-calculation-view',
  templateUrl: './calculation-view.component.html',
  standalone: true,
  imports: [
    CalculationContainerComponent,
    BreadcrumbsModule,
    PushPipe,
    LegacyAppComponent,
  ],
  providers: [TranslocoDecimalPipe],
})
export class CalculationViewComponent {
  public readonly isStandalone$ = this.settingsFacade.isStandalone$;

  public isBearingSupported$ = this.productSelectionFacade.isBearingSupported$;
  public readonly bearingDesignation$ =
    this.productSelectionFacade.bearingDesignation$;

  public breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject(
    this.getBreadcrumbs()
  );

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly settingsFacade: SettingsFacade,
    private readonly productSelectionFacade: ProductSelectionFacade
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
