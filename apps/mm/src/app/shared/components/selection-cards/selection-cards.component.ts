import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { TranslocoTestingModule } from '@jsverse/transloco';
import { MagneticSliderComponent } from '@mm/shared/components/magnetic-slider/magnetic-slider.component';
import { ListValue } from '@mm/shared/models/list-value.model';

import { PictureCardModule } from '@schaeffler/picture-card';
@Component({
  selector: 'mm-selection-cards',
  templateUrl: './selection-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PictureCardModule, MagneticSliderComponent, TranslocoTestingModule],
})
export class SelectionCardsComponent {
  @Input() public selectedId: string | undefined;
  @Input() public options: ListValue[];

  @Output() public selectedOption: EventEmitter<string> = new EventEmitter();

  cardAction(selectionId: string): void {
    this.selectedOption.emit(selectionId);
  }
}
