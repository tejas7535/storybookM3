import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { GridResultItemsComponent } from '../grid-result-items/grid-result-items.component';
import { GridResultItemCardComponent } from './grid-result-item-card.component';

describe('GridResultItemCardComponent', () => {
  let spectator: Spectator<GridResultItemCardComponent>;
  let component: GridResultItemCardComponent;

  const createComponent = createComponentFactory({
    component: GridResultItemCardComponent,
    imports: [
      MatCardModule,
      MatDividerModule,
      LayoutModule,
      MatExpansionModule,
      MatIcon,
      MockComponent(GridResultItemsComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        title: 'Test Title',
        resultItems: [],
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hasResultItems', () => {
    it('should return false when resultItems is empty', () => {
      spectator.setInput('resultItems', []);
      expect(component.hasResultItems()).toBe(false);
    });

    it('should return true when resultItems contains items', () => {
      spectator.setInput('resultItems', [
        {
          abbreviation: 'item1',
          value: '10mm',
          title: 'Item 1',
          isImportant: false,
        },
      ]);
      expect(component.hasResultItems()).toBe(true);
    });

    it('should display the provided title', () => {
      spectator.setInput('resultItems', [
        {
          abbreviation: 'item1',
          value: '10mm',
          title: 'Item 1',
          isImportant: false,
        },
      ]);
      const expectedTitle = 'Custom Card Title';
      spectator.setInput('title', expectedTitle);

      const titleElement = spectator.query('h3');

      expect(titleElement?.textContent?.trim()).toBe(expectedTitle);
    });
  });

  describe('hasAdditionalItems', () => {
    it('should return false when additionalResultItems is empty', () => {
      spectator.setInput('additionalResultItems', []);
      expect(component.hasAdditionalItems()).toBe(false);
    });

    it('should return true when additionalResultItems contains items', () => {
      spectator.setInput('additionalResultItems', [
        {
          abbreviation: 'item1',
          value: '10mm',
          title: 'Item 1',
          isImportant: false,
        },
      ]);
      expect(component.hasAdditionalItems()).toBe(true);
    });
  });

  describe('expnasionButtonText', () => {
    it('should return expandItemsTitle when showAdditional is false', () => {
      const expandText = 'Show more items';
      spectator.setInput('expandItemsTitle', expandText);
      spectator.component.showAdditional.set(false);

      expect(component.expansionButtonText()).toBe(expandText);
    });

    it('should return collapseItemsTitle when showAdditional is true', () => {
      const collapseText = 'Hide additional items';
      spectator.setInput('collapseItemsTitle', collapseText);
      spectator.component.showAdditional.set(true);

      expect(component.expansionButtonText()).toBe(collapseText);
    });
  });

  describe('toggleAdditional', () => {
    it('should toggle the showAdditional signal from false to true', () => {
      expect(component.showAdditional()).toBe(false);

      component.toggleAdditional();

      expect(component.showAdditional()).toBe(true);
    });

    it('should toggle the showAdditional signal from true to false', () => {
      component.showAdditional.set(true);
      expect(component.showAdditional()).toBe(true);

      component.toggleAdditional();

      expect(component.showAdditional()).toBe(false);
    });

    it('should hide additional items section when showAdditional is false', () => {
      const additionalItems: ResultItem[] = [
        {
          abbreviation: 'additional1',
          value: '15mm',
          unit: 'cm',
          designation: 'Additional 1',
          isImportant: false,
        },
      ];

      spectator.setInput('additionalResultItems', additionalItems);
      component.showAdditional.set(false);
      spectator.detectChanges();

      const additionalSection = spectator.query('.additional-items');
      expect(additionalSection).toBeFalsy();
    });
  });
});
