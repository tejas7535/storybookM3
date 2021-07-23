import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'schaeffler-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss'],
})
export class SubheaderComponent {
  @Input() public showBackButton = true;
  @Input() public title = '';
  @Output() public backButtonClicked = new EventEmitter();

  public clickBackButton(): void {
    this.backButtonClicked.emit();
  }
}
