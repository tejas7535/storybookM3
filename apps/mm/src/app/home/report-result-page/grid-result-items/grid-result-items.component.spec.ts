import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';
import { ResponsiveGridComponent } from '@mm/shared/components/responsive-grid/responsive-grid.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { GridResultItemsComponent } from './grid-result-items.component';

describe('GridResultItemsComponent', () => {
  let spectator: Spectator<GridResultItemsComponent>;
  const createComponent = createComponentFactory({
    component: GridResultItemsComponent,
    imports: [
      CommonModule,
      MatDividerModule,
      MockComponent(ResponsiveGridComponent),
    ],

    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render resultItems correctly', () => {
    const mockResultItems = [
      { designation: 'Item 1', unit: 'kg' },
      { designation: 'Item 2', unit: 'cm' },
    ] as ResultItem[];

    spectator = createComponent({
      props: {
        resultItems: mockResultItems,
      },
    });

    spectator.detectChanges();

    const resultItemsElements: ResponsiveGridComponent<ResultItem[]> =
      spectator.query(ResponsiveGridComponent<ResultItem[]>);

    expect(resultItemsElements).toBeTruthy();
  });
});
