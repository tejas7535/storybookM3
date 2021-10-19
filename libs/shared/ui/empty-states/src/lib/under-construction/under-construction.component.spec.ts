import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import enJson from './i18n/en.json';
import { UnderConstructionComponent } from './under-construction.component';

describe('UnderConstructionComponent', () => {
  let spectator: Spectator<UnderConstructionComponent>;
  let component: UnderConstructionComponent;

  const createComponent = createComponentFactory({
    component: UnderConstructionComponent,
    imports: [
      provideTranslocoTestingModule({ 'under-construction/en': enJson }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create component with default title and message', () => {
    expect(component).toBeTruthy();
    expect(spectator.query('p')).toHaveTextContent('underConstructionMessage');
    expect(spectator.query('h4')).toHaveTextContent('underConstruction');
  });

  it('should create component with custom title and message', () => {
    component.title = 'Upcoming feature!';
    component.message = 'This feature will come soon.';
    spectator.detectChanges();

    expect(component).toBeTruthy();
    expect(spectator.query('p')).toHaveTextContent(
      'This feature will come soon.'
    );
    expect(spectator.query('h4')).toHaveTextContent('Upcoming feature!');
  });
});
