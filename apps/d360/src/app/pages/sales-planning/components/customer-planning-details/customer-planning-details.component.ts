import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { tap } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PlanningLevelMaterial } from '../../../../feature/sales-planning/model';
import { PlanningLevelService } from '../../../../feature/sales-planning/planning-level.service';
import { CustomerPlanningLevelConfigurationModalComponent } from '../customer-planning-level-configuration-modal/customer-planning-level-configuration-modal.component';

@Component({
  selector: 'd360-customer-planning-details',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIcon,
    MatIconButton,
    MatButton,
  ],
  templateUrl: './customer-planning-details.component.html',
})
export class CustomerPlanningDetailsComponent {
  private readonly planningLevelService = inject(PlanningLevelService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public readonly planningLevelMaterialConfiguration =
    signal<PlanningLevelMaterial | null>(null);
  public readonly openPanelContent = signal(true);
  public readonly customerName = input.required<string>();
  public readonly customerNumber = input.required<string>();

  public constructor() {
    effect(
      () => {
        this.planningLevelMaterialConfiguration.set(null);

        if (this.customerNumber() !== null && this.customerName() !== null) {
          this.fetchPlanningLevelMaterial(this.customerNumber());
        }
      },
      { allowSignalWrites: true }
    );
  }

  public handlePlanningLevelModalClicked() {
    this.dialog
      .open(CustomerPlanningLevelConfigurationModalComponent, {
        data: {
          customerName: this.customerName(),
          customerNumber: this.customerNumber(),
          planningLevelMaterial: this.planningLevelMaterialConfiguration(),
        },
        width: '600px',
        maxWidth: '900px',
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        tap(({ deleteExistingPlanningData, newPlanningLevelMaterialType }) => {
          if (deleteExistingPlanningData) {
            this.planningLevelService
              .deleteMaterialTypeByCustomerNumber(this.customerNumber())
              .subscribe();
          }

          if (newPlanningLevelMaterialType) {
            this.planningLevelMaterialConfiguration.set({
              ...this.planningLevelMaterialConfiguration(),
              planningLevelMaterialType: newPlanningLevelMaterialType,
            });

            // TODO: Reload data from the table, done with D360-166
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public isNoCustomerSelected() {
    return this.customerName() === null && this.customerNumber() === null;
  }

  private fetchPlanningLevelMaterial(customerNumber: string) {
    this.planningLevelService
      .getMaterialTypeByCustomerNumber(customerNumber)
      .pipe(
        tap((data) => this.planningLevelMaterialConfiguration.set(data)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
