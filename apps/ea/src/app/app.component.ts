import { Component } from '@angular/core';

import { SettingsFacade } from '@ea/core/store';

import { CalculationParametersFacade } from './core/store/facades/calculation-parameters/calculation-parameters.facade';
@Component({
  selector: 'ea-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'Engineering App';
  public bearingDesignation$ = this.settingsFacade.bearingDesignation$;

  public calculationParameters$ =
    this.calculationParametersFacade.calculationParameters$;

  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade
  ) {}
}
