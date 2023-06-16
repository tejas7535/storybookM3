import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from './i18n/en.json';
import { MaintenanceComponent } from './maintenance.component';

describe('MaintenanceComponent', () => {
  let spectator: Spectator<MaintenanceComponent>;
  let component: MaintenanceComponent;
  const createComponent = createComponentFactory({
    component: MaintenanceComponent,
    imports: [provideTranslocoTestingModule({ 'maintenance/en': en })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create component with default title and subtitle', () => {
    expect(component).toBeTruthy();
    expect(spectator.query('h4')).toHaveTextContent('title');
    expect(spectator.query('span')).toHaveTextContent('subtitle');
  });

  it('should create component with custom title and subtitle', () => {
    const title = 'Custom title';
    const subtitle = 'Custom subtitle';

    component.title = title;
    component.subtitle = subtitle;
    spectator.detectChanges();

    expect(component).toBeTruthy();
    expect(spectator.query('h4')).toHaveTextContent(title);
    expect(spectator.query('span')).toHaveTextContent(subtitle);
  });
});
