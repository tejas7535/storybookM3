import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { PreferredGreaseOption } from '@ga/shared/models';
import { Grease } from '@ga/shared/services/greases/greases.service';

import { CalculationParametersActions } from '../../actions';
import {
  applicationScenarioDisabledHint,
  getAllGreases,
  getCompetitorsGreases,
  getGreaseApplication,
  getMixableSchaefflerGreases,
  getMotionType,
  getPreferredGrease,
  getSchaefflerGreases,
  getSelectedCompetitorGreaseFromPreferred,
  isVerticalAxisOrientation,
  preselectionDisabledHint,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationParametersFacade {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  public readonly isVerticalAxisOrientation$ = this.store.select(
    isVerticalAxisOrientation
  );

  public readonly selectedGreaseApplication$ =
    this.store.select(getGreaseApplication);

  public readonly motionType$ = this.store.select(getMotionType);

  public readonly competitorsGreases$ = this.store.select(
    getCompetitorsGreases
  );

  public readonly schaefflerGreases$ = this.store.select(getSchaefflerGreases);

  public readonly mixableSchaefflerGreases$ = this.store.select(
    getMixableSchaefflerGreases
  );

  public readonly selectedCompetitorGrease$ = this.store.select(
    getSelectedCompetitorGreaseFromPreferred
  );

  public readonly preferredGrease = toSignal(
    this.store.select(getPreferredGrease)
  );

  public readonly allGreases = toSignal(this.store.select(getAllGreases));

  public readonly applicationScenarioDisabledHint = toSignal(
    this.store.select(applicationScenarioDisabledHint)
  );
  public readonly preselectionDisabledHint = toSignal(
    this.store.select(preselectionDisabledHint)
  );

  public setAutomaticLubrication(automaticLubrication: boolean): void {
    this.dispatch(
      CalculationParametersActions.setAutomaticLubrication({
        automaticLubrication,
      })
    );
  }

  public loadAppGreases(): void {
    this.dispatch(CalculationParametersActions.loadCompetitorsGreases());
    this.dispatch(CalculationParametersActions.loadSchaefflerGreases());
  }

  public setGreaseSearchSelection(grease: Grease): void {
    const selectedGrease: PreferredGreaseOption = {
      id: grease.id,
      text: grease.name,
    };

    this.dispatch(
      CalculationParametersActions.setPreferredGreaseSelection({
        selectedGrease,
      })
    );

    this.router.navigate([`${AppRoutePath.GreaseMiscibilityPath}`]);
  }

  public setSelectedGrease(selectedGrease: PreferredGreaseOption): void {
    this.dispatch(
      CalculationParametersActions.setPreferredGreaseSelection({
        selectedGrease,
      })
    );
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
