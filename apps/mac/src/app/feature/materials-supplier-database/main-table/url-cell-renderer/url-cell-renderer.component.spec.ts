import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { UrlCellRendererComponent } from './url-cell-renderer.component';

describe('UrlCellRendererComponent', () => {
  let component: UrlCellRendererComponent;
  let spectator: Spectator<UrlCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: UrlCellRendererComponent,
    declarations: [UrlCellRendererComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set url', () => {
    const url = 'http://test.de';

    expect(component.url).toBeUndefined();

    component.agInit({ value: url } as ICellRendererParams);

    expect(component.url).toBe(url);
  });
});
