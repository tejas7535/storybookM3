import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

import { BehaviorSubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { ResponsiveGridComponent } from './responsive-grid.component';

describe('ResponsiveGridComponent', () => {
  const oberverPointsSubject$ = new BehaviorSubject({
    matches: false,
    breakpoints: {},
  });

  const breakpointObserverMock = {
    observe: jest.fn().mockReturnValue(oberverPointsSubject$.asObservable()),
  };

  let spectator: Spectator<ResponsiveGridComponent<any>>;
  const createComponent = createComponentFactory({
    component: ResponsiveGridComponent,
    imports: [MockModule(MatDividerModule), CommonModule],
    providers: [
      {
        provide: BreakpointObserver,
        useValue: breakpointObserverMock,
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('items', []);
    spectator.detectChanges();
  });

  it('should compute columns based on breakpoints', () => {
    oberverPointsSubject$.next({
      matches: true,
      breakpoints: {
        [Breakpoints.XSmall]: true,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
      },
    });

    expect(spectator.component.columns()).toBe(1);
  });

  it('should compute gridClass correctly', () => {
    spectator.setInput('items', [1, 2, 3, 4]);
    spectator.setInput('maxColumns', 4);

    oberverPointsSubject$.next({
      matches: true,
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: true,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
      },
    });

    expect(spectator.component.gridClass()).toBe(
      'grid gap-2 grid-cols-1 sm:grid-cols-2'
    );
  });

  it('should determine if a divider should be shown', () => {
    spectator.setInput('maxColumns', 3);

    expect(spectator.component.shouldShowDivider(0, false)).toBe(true);
    expect(spectator.component.shouldShowDivider(2, false)).toBe(true);
    expect(spectator.component.shouldShowDivider(3, true)).toBe(false);
  });

  it('should determine if an index is the end of a row', () => {
    spectator.setInput('items', [1, 2, 3, 4, 5]);
    oberverPointsSubject$.next({
      matches: true,
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: true,
        [Breakpoints.Large]: false,
      },
    });

    spectator.detectChanges();

    expect(spectator.component.isEndOfRow(0)).toBe(false);
    expect(spectator.component.isEndOfRow(1)).toBe(false);
    expect(spectator.component.isEndOfRow(2)).toBe(true);
    expect(spectator.component.isEndOfRow(4)).toBe(true);
  });

  it('should determine if an index is in the last row', () => {
    spectator.setInput('maxColumns', 3);
    spectator.setInput('items', [1, 2, 3, 4, 5]);

    oberverPointsSubject$.next({
      matches: true,
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: true,
      },
    });

    expect(spectator.component.isLastRow(3)).toBe(true);
    expect(spectator.component.isLastRow(4)).toBe(true);
    expect(spectator.component.isLastRow(2)).toBe(false);
  });

  it('should track items using the trackBy function', () => {
    const trackByFn = jest.fn((_index, item) => item.id);
    spectator.setInput('trackBy', trackByFn);

    const item = { id: 1 };
    expect(spectator.component.trackItem(0, item)).toBe(1);
    expect(trackByFn).toHaveBeenCalledWith(0, item);
  });
});
