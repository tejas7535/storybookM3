import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-roles-description',
  templateUrl: './roles-description.component.html',
})
export class RolesDescriptionComponent {
  public translationKey: string;
  @Input() roles: string[];
  @Input() set key(value: string) {
    this.translationKey = `userSettings.rolesRights.${value}`;
  }

  public trackByFn(index: number): number {
    return index;
  }
}
