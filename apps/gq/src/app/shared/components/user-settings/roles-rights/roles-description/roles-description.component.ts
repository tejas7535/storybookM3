import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-roles-description',
  templateUrl: './roles-description.component.html',
  standalone: false,
})
export class RolesDescriptionComponent {
  public translationKey: string;
  @Input() roles: string[];
  @Input() set key(value: string) {
    this.translationKey = `userSettings.rolesRights.${value}`;
  }
}
