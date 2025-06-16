import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GreaseSelectionAdvertComponent } from './grease-selection-advert.component';

describe('GreaseSelectionAdvertComponent', () => {
  let component: GreaseSelectionAdvertComponent;
  let spectator: Spectator<GreaseSelectionAdvertComponent>;

  const createComponent = createComponentFactory({
    component: GreaseSelectionAdvertComponent,
    imports: [MatIconModule, provideTranslocoTestingModule({ en: {} })],
    detectChanges: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the NEW badge with auto_awesome icon', () => {
    const badgeElement = spectator.query('.bg-primary');
    expect(badgeElement).toHaveText('auto_awesome greaseMiscibility.tag');

    const iconElement = spectator.query('mat-icon');
    expect(iconElement).toHaveText('auto_awesome');
  });

  it('should display text about greases available for interchangeability', () => {
    const textElement = spectator.query('.font-medium:not(.bg-primary)');
    expect(textElement).toHaveText('greaseMiscibility.advert');
  });

  it('should have proper styling for the NEW badge', () => {
    const badgeElement = spectator.query('.bg-primary');
    expect(badgeElement).toHaveClass('text-on-primary');
    expect(badgeElement).toHaveClass('rounded-full');
    expect(badgeElement).toHaveClass('animate-pulse');
  });
});
