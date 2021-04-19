import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'cdba-bom-overlay',
  templateUrl: './bom-overlay.component.html',
  styleUrls: ['./bom-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomOverlayComponent {
  @Output()
  private readonly closeOverlay: EventEmitter<void> = new EventEmitter();

  public onClose(): void {
    this.closeOverlay.emit();
  }
}
