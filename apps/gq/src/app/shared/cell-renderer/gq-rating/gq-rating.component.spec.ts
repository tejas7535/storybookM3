import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { GqRatingComponent } from './gq-rating.component';

describe('GqRatingComponent', () => {
  let component: GqRatingComponent;
  let spectator: Spectator<GqRatingComponent>;

  const createComponent = createComponentFactory({
    component: GqRatingComponent,
    declarations: [GqRatingComponent],
    imports: [MatIconModule],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set price', () => {
      const params: any = {
        value: 2,
      };
      component.agInit(params);

      expect(component.rating).toEqual(2);
    });
  });

  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
