import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PmgmArrowComponent } from './pmgm-arrow.component';

describe('PmgmArrowComponent', () => {
  let component: PmgmArrowComponent;
  let spectator: Spectator<PmgmArrowComponent>;

  const createComponent = createComponentFactory({
    component: PmgmArrowComponent,
    detectChanges: false,
    imports: [MatIconModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set arrow', () => {
      component.agInit({ value: 'value' } as any);
      expect(component.arrow).toEqual('value');
    });
  });

  describe('refresh', () => {
    it('should throw error', () => {
      expect(component.refresh()).toBeFalsy();
    });
  });
});
