import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mm-app-store-buttons',
  templateUrl: './app-store-buttons.component.html',
})
export class AppStoreButtonsComponent {
  @Input() public title?: string;

  @Output() public appStoreClick = new EventEmitter<string>();

  public onAppStoreClick(storeName: string): void {
    this.appStoreClick.emit(storeName);
  }
}
