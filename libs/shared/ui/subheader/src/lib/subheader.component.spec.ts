import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SubheaderComponent } from './subheader.component';

describe('SubheaderComponent', () => {
  let component: SubheaderComponent;
  let spectator: Spectator<SubheaderComponent>;

  const createComponent = createComponentFactory({
    component: SubheaderComponent,
    imports: [CommonModule, MatIconModule],
    declarations: [SubheaderComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickBackButton', () => {
    test('should emit backButtonClicked', () => {
      component.backButtonClicked.emit = jest.fn();

      component.clickBackButton();

      expect(component.backButtonClicked.emit).toHaveBeenCalledTimes(1);
    });
  });
});
