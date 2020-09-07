import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { BomItem } from '../../../core/store/reducers/detail/models';

@Component({
  selector: 'cdba-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalInformationComponent {
  @Input() children: BomItem[];
  @Input() bomLoading: boolean;

  @Output() private readonly closeOverlay: EventEmitter<
    void
  > = new EventEmitter();

  public onClose(): void {
    this.closeOverlay.emit();
  }
}
