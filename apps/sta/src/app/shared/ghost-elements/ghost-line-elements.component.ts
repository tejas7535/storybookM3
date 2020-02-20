import { Component, Input } from '@angular/core';

@Component({
  selector: 'sta-ghost-line-elements',
  templateUrl: './ghost-line-elements.component.html',
  styleUrls: ['./ghost-line-elements.component.scss']
})
export class GhostLineElementsComponent {
  @Input() public numberOfLines: Number = 3;

  public createArray(length: Number): any[] {
    return Array(length);
  }
}
