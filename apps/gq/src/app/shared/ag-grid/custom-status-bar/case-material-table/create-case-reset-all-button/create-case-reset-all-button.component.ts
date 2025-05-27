import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { map, Observable } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-create-case-reset-all-button',
  imports: [MatButtonModule, SharedTranslocoModule, MatIconModule, PushPipe],
  templateUrl: './create-case-reset-all-button.component.html',
})
export class CreateCaseResetAllButtonComponent {
  private readonly createCaseFacade = inject(CreateCaseFacade);

  buttonDisabled$: Observable<boolean> =
    this.createCaseFacade.customerIdForCaseCreation$.pipe(
      map((customerId) => !customerId)
    );

  agInit(): void {}
  resetAll(): void {
    this.createCaseFacade.clearCreateCaseRowData();
  }
}
