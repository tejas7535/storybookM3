import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PropertyDelta } from '@gq/core/store/f-pricing/models/property-delta.interface';

import { TagComponent } from '@schaeffler/tag';

import { DeltaDisplayPipe } from './pipes/delta-display.pipe';
import { DeltaTagTypePipe } from './pipes/delta-tag-type.pipe';
@Component({
  selector: 'gq-delta-value',
  imports: [
    CommonModule,
    MatIconModule,
    TagComponent,
    DeltaDisplayPipe,
    DeltaTagTypePipe,
  ],
  templateUrl: './delta-value.component.html',
})
export class DeltaValueComponent {
  @Input() delta: PropertyDelta;
}
