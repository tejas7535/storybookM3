import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ga-app-store-buttons',
  templateUrl: './app-store-buttons.component.html',
  standalone: true,
})
export class AppStoreButtonsComponent {
  @Input() public title?: string;

  @Output() public appStoreClick = new EventEmitter<string>();

  public onAppStoreClick(storeName: string): void {
    this.appStoreClick.emit(storeName);
  }
}
