import { Component } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ContentWrapperComponent } from './content-wrapper.component';

@Component({
  selector: 'app-test-host-component',
  standalone: true,
  imports: [ContentWrapperComponent],
  template: `
    <app-content-wrapper [fullHeight]="fullHeight"></app-content-wrapper>
  `,
})
class TestHostComponent {
  fullHeight = false;
}

describe('ContentWrapperComponent', () => {
  let spectator: Spectator<TestHostComponent>;

  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [ContentWrapperComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have correct input binding', () => {
    const testHostComponent = spectator.component;
    testHostComponent.fullHeight = true;
    spectator.detectChanges();

    const contentWrapperElement: HTMLElement =
      spectator.query('.content-wrapper');
    expect(
      contentWrapperElement.classList.contains('full-height')
    ).toBeTruthy();

    testHostComponent.fullHeight = false;
    spectator.detectChanges();
    expect(contentWrapperElement.classList.contains('full-height')).toBeFalsy();
  });
});
