import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AlertComponent, AlertType } from './alert.component';

describe('AlertComponent', () => {
  let spectator: Spectator<AlertComponent>;
  let component: AlertComponent;

  const createComponent = createComponentFactory({
    component: AlertComponent,
    imports: [CommonModule, MatIconModule, MatButtonModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { type: '', actionText: 'someAction' },
    });
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct icon for each alert type', () => {
    const iconMap: { [key in AlertType]: string } = {
      success: 'task_alt',
      warning: 'warning_amber',
      error: 'error_outline',
      info: 'info_outline',
      '': '',
    };

    Object.keys(iconMap).forEach((type) => {
      spectator.setInput('type', type as AlertType);

      spectator.detectChanges();
      const icon = spectator.query('mat-icon');
      expect(icon).toHaveText(iconMap[type as AlertType]);
    });
  });

  it('should emit buttonClicked event when button is clicked', () => {
    jest.spyOn(component.buttonClicked, 'emit');

    spectator.click('button');
    expect(component.buttonClicked.emit).toHaveBeenCalled();
  });

  it('should apply the correct background class based on alert type', () => {
    const type = 'success';

    spectator.setInput('type', type as AlertType);
    spectator.detectChanges();
    const alertContainer = spectator.query('.alert-success');
    expect(alertContainer).not.toBeNull();
  });
});
