import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { Observable } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { AuthService } from '../../../../../../../shared/utils/auth/auth.service';
import { salesPlanningAllowedEditRoles } from '../../../../../../../shared/utils/auth/roles';

@Component({
  selector: 'd360-sales-planning-edit-button',
  imports: [MatTooltip, MatIcon, MatIconButton, PushPipe],
  templateUrl: './sales-planning-edit-button.component.html',
  styleUrl: './sales-planning-edit-button.component.scss',
})
export class SalesPlanningEditButtonComponent {
  private readonly authService: AuthService = inject(AuthService);

  protected isUserAllowedToEdit$: Observable<boolean> =
    this.authService.hasUserAccess(salesPlanningAllowedEditRoles);

  protected showEditButton: Signal<boolean> = computed(
    () => this.editStatus() !== '2'
  );

  protected disableEditButton: Signal<boolean> = computed(() =>
    ['3', '4'].includes(this.editStatus())
  );

  protected tooltipText: Signal<string> = computed(() => {
    if (this.editStatus() === '3') {
      return translate('sales_planning.table.planExistsOnOtherLevel');
    } else if (this.editStatus() === '4') {
      return translate('sales_planning.table.planOnlyInPlanningCurrency');
    }

    return null;
  });

  public editStatus: InputSignal<string> = input.required();

  public editClick: OutputEmitterRef<void> = output();
}
