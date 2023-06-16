import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { IndicatorComponent } from './indicator.component';

describe('IndicatorComponent', () => {
  let component: IndicatorComponent;
  let spectator: Spectator<IndicatorComponent>;

  const createComponent = createComponentFactory({
    component: IndicatorComponent,
    detectChanges: false,
    imports: [MatIconModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.detectChanges();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should iterate correctly', () => {
    component.of = 3;
    const it = component.getIterable();
    expect(it.next().value).toBe(0);
    expect(it.next().value).toBe(1);
    expect(it.next().value).toBe(2);
    expect(it.next().done).toBeTruthy();
  });

  it('should return correct class', () => {
    component.val = 2;
    component.activeClass = 'test';
    expect(component.getClass(0)).toBe('test');
    expect(component.getClass(1)).toBe('test');
    expect(component.getClass(2)).toBeFalsy();
    expect(component.getClass(3)).toBeFalsy();
  });
});
