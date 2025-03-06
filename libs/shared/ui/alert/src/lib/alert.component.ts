import { CommonModule } from '@angular/common';
import { Component, computed, input, output, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type AlertType = 'info' | 'success' | 'error' | 'warning' | '';

@Component({
  selector: 'schaeffler-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule],

  // FIXME: Remove the next line after storybook was updated to a version, where Standalone-Components
  // without standalone property were supported.
  // Angular 19 standalone: true is default, so it's not needed anymore
  standalone: true,
})
export class AlertComponent {
  public withIcon = input<boolean>(true);
  public type = input.required<AlertType>();
  public headline = input<string>();
  public description = input<string>();
  public actionText = input.required<string>();
  public showIcon = input<boolean>(true);

  public buttonClicked = output();

  public iconClass: Signal<string> = computed(() => {
    switch (this.type()) {
      case 'success': {
        return 'task_alt';
      }
      case 'warning': {
        return 'warning_amber';
      }
      case 'error': {
        return 'error_outline';
      }
      case 'info': {
        return 'info_outline';
      }
      default: {
        return '';
      }
    }
  });

  public alertBackgroundClass: Signal<string> = computed(
    () => `alert-${this.type()}`
  );

  public onButtonClick(): void {
    this.buttonClicked.emit();
  }
}
