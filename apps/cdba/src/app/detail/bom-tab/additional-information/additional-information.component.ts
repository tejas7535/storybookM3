import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cdba-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss'],
})
export class AdditionalInformationComponent {
  @Output() private readonly closeOverlay: EventEmitter<
    void
  > = new EventEmitter();

  public onClose(): void {
    this.closeOverlay.emit();
  }
}
