import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import * as rxjs from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../../../assets/i18n/en.json';
import { QuickFiltersListComponent } from './quick-filters-list.component';
import { QuickFiltersListConfig } from './quick-filters-list-config.model';

describe('QuickFiltersListComponent', () => {
  let component: QuickFiltersListComponent;
  let spectator: Spectator<QuickFiltersListComponent>;

  const createComponent = createComponentFactory({
    component: QuickFiltersListComponent,
    declarations: [QuickFiltersListComponent],
    imports: [provideTranslocoTestingModule({ en })],
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

  test('should emit on destroy', () => {
    component['destroy$'].next = jest.fn();
    component['destroy$'].complete = jest.fn();

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  describe('ngAfterViewInit', () => {
    beforeEach(() => {
      component.searchField = { nativeElement: {} as HTMLInputElement };
    });

    test('should trigger search', () => {
      component.config = {
        searchable: true,
        search: jest.fn(),
      } as unknown as QuickFiltersListConfig;
      const searchExpression = 'test';

      jest
        .spyOn(rxjs, 'fromEvent')
        .mockReturnValue(rxjs.of({ target: { value: searchExpression } }));

      component.ngAfterViewInit();

      expect(component.config.search).toHaveBeenCalledWith(searchExpression);
    });

    test('should not trigger search', () => {
      component.config = {
        searchable: false,
        search: jest.fn(),
      } as unknown as QuickFiltersListConfig;

      jest
        .spyOn(rxjs, 'fromEvent')
        .mockReturnValue(rxjs.of({ target: { value: 'test' } }));

      component.ngAfterViewInit();

      expect(component.config.search).not.toHaveBeenCalled();
    });
  });

  describe('set config', () => {
    test('should use default table config', () => {
      const config = {
        icon: 'test_icon',
        titleTranslationKeySuffix: 'test',
      } as unknown as QuickFiltersListConfig;

      component.config = config;

      expect(component.config).toEqual({
        ...config,
        tableConfig: component['defaultTableConfig'],
      });
    });

    test('should use custom table config', () => {
      const config = {
        icon: 'test_icon',
        titleTranslationKeySuffix: 'test',
        tableConfig: {
          headersTranslationKeySuffixes: ['sa', 'sb', 'sc'],
          dataFields: ['a', 'b', 'c'],
        },
      } as unknown as QuickFiltersListConfig;

      component.config = config;

      expect(component.config).toEqual(config);
    });
  });
});
