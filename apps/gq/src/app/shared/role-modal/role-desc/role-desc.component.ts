import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-role-desc',
  templateUrl: './role-desc.component.html',
})
export class RoleDescComponent {
  public translationKey: string;
  @Input() roles: string[];
  @Input() set key(value: string) {
    this.translationKey = `shared.roleModal.${value}`;
  }

  public trackByFn(index: number): number {
    return index;
  }
}
