import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ActionButtonComponent } from './action-button.component';

@Component({
  selector: 'd360-test-host-component',
  imports: [ActionButtonComponent],
  template: `
    <d360-action-button
      [tooltip]="tooltip()"
      [disabled]="disabled()"
    ></d360-action-button>
  `,
})
class TestHostComponent {
  tooltip = signal('');
  disabled = signal(false);
}

describe('ActionButtonComponent', () => {
  let component: ActionButtonComponent;
  let spectator: Spectator<TestHostComponent>;

  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [
      ActionButtonComponent,
      TestHostComponent,
      CommonModule,
      MatButtonModule,
      MatTooltipModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.query(ActionButtonComponent);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have correct inputs', () => {
    const tooltip = 'Tooltip Text';
    const disabled = true;

    expect(component['tooltip']()).toEqual('');
    expect(component['disabled']()).toBeFalsy();

    const testHostComponent = spectator.component;
    testHostComponent['tooltip'].set(tooltip);
    testHostComponent['disabled'].set(disabled);
    spectator.detectChanges();

    expect(component['tooltip']()).toEqual(tooltip);
    expect(component['disabled']()).toEqual(disabled);
  });
});
