import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_SELECT_CONFIG } from '@angular/material/select';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { InfoTooltipComponent } from '@lsa/shared/components/info-tooltip/info-tooltip.component';
import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { LubricantType } from '@lsa/shared/constants';
import { Grease, LubricantForm } from '@lsa/shared/models';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';

const translatePath = 'recommendation.lubrication';

@Component({
  selector: 'lsa-lubricant',
  standalone: true,
  imports: [
    RadioButtonGroupComponent,
    TranslocoModule,
    MatDividerModule,
    ReactiveFormsModule,
    SelectModule,
    InfoTooltipComponent,
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

  public readonly lubricantRadioOptions: {
    value: LubricantType;
    name: string;
  }[] = [
    {
      value: LubricantType.Arcanol,
      name: translate(
        `${translatePath}.options.${LubricantType.Arcanol.toLowerCase()}`
      ),
    },
    {
      value: LubricantType.Grease,
      name: translate(
        `${translatePath}.options.${LubricantType.Grease.toLowerCase()}`
      ),
    },
    {
      value: LubricantType.Oil,
      name: translate(
        `${translatePath}.options.${LubricantType.Oil.toLowerCase()}`
      ),
    },
  ];

  public readonly arcanolType: LubricantType = LubricantType.Arcanol;

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
