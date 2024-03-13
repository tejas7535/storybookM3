import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RecommendationTableCellComponent } from './recommendation-table-cell.component';

describe('RecommendationTableCellComponent', () => {
  let component: RecommendationTableCellComponent;
  let spectator: Spectator<RecommendationTableCellComponent>;

  const createComponent = createComponentFactory({
    component: RecommendationTableCellComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
