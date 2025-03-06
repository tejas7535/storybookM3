import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'cdba-role-descriptions-dialog',
  templateUrl: './role-descriptions-dialog.component.html',
  standalone: false,
})
export class RoleDescriptionsDialogComponent implements AfterViewInit {
  // Workaround for angular component issue #13870
  disableAnimation = true;

  ngAfterViewInit(): void {
    setTimeout(() => (this.disableAnimation = false));
  }
}
