import { MatCard } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { MediasViewProductButtonComponent } from '../medias-view-product-button/medias-view-product-button.component';
import { SleeveConnectorComponent } from './sleeve-connector.component';

describe('SleeveConnectorComponent', () => {
  let spectator: Spectator<SleeveConnectorComponent>;

  const createComponent = createComponentFactory({
    component: SleeveConnectorComponent,
    imports: [
      MockComponent(MatCard),
      MockComponent(MediasViewProductButtonComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should not display card content when no sleeve connectors are provided', () => {
    expect(spectator.query(MatCard)).not.toExist();
  });

  describe('when sleeve connectors are provided', () => {
    beforeEach(() => {
      spectator.setInput('sleeveConnectors', [
        {
          designation: 'Sleeve Connector ',
          value: 'Sleeve Connector',
        },
        {
          designation: 'Number of sleeve connectors',
          value: 1,
        },
      ]);

      spectator.setInput('title', 'Sleeve Connector');
      spectator.detectChanges();
    });

    it('should display card content', () => {
      expect(spectator.query(MatCard)).toExist();
    });

    it('should display title', () => {
      expect(spectator.query('h3')).toHaveText('Sleeve Connector');
    });
  });
});
