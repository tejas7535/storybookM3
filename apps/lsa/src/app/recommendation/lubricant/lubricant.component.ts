import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_SELECT_CONFIG } from '@angular/material/select';

import { combineLatest, map, Observable } from 'rxjs';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { InfoTooltipComponent } from '@lsa/shared/components/info-tooltip/info-tooltip.component';
import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { LubricantType } from '@lsa/shared/constants';
import { Grease, LubricantForm } from '@lsa/shared/models';
import { PushPipe } from '@ngrx/component';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';

const translatePath = 'recommendation.lubrication';

@Component({
  selector: 'lsa-lubricant',
  imports: [
    RadioButtonGroupComponent,
    TranslocoModule,
    MatDividerModule,
    ReactiveFormsModule,
    SelectModule,
    InfoTooltipComponent,
    PushPipe,
  ],
  templateUrl: './lubricant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'lubricantPanelOverlay' },
    },
  ],
})
export class LubricantComponent {
  @Input()
  public lubricantForm: FormGroup<LubricantForm>;

  @Input() greases: Grease[];
  public readonly arcanolType: LubricantType = LubricantType.Arcanol;

  constructor(private readonly translocoService: TranslocoService) {}

  public get lubricantRadioOptions(): Observable<
    { value: LubricantType; name: string }[]
  > {
    return combineLatest([
      this.translocoService.selectTranslate(
        `${translatePath}.options.${LubricantType.Arcanol.toLowerCase()}`
      ),
      this.translocoService.selectTranslate(
        `${translatePath}.options.${LubricantType.Grease.toLowerCase()}`
      ),
      this.translocoService.selectTranslate(
        `${translatePath}.options.${LubricantType.Oil.toLowerCase()}`
      ),
    ]).pipe(
      map(([arcanol, grease, oil]) => [
        {
          value: LubricantType.Arcanol,
          name: arcanol,
        },
        {
          value: LubricantType.Grease,
          name: grease,
        },
        {
          value: LubricantType.Oil,
          name: oil,
        },
      ])
    );
  }

  public filterFn = (option?: StringOption, value?: string) => {
    if (!value) {
      return true;
    }

    return option?.title
      ?.toLowerCase()
      .trim()
      .includes(value.toLowerCase().trim());
  };
}
