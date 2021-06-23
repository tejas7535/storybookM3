import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { ResignationsComponent } from './resignations.component';

describe('ResignationsComponent', () => {
  let component: ResignationsComponent;
  let spectator: Spectator<ResignationsComponent>;

  const createComponent = createComponentFactory({
    component: ResignationsComponent,
    detectChanges: false,
    imports: [SharedModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getRowClass', () => {
    test('should return correct css classes', () => {
      expect(component.getRowClass()).toEqual('border-2 border-veryLight');
    });
  });

  describe('defaultColDef', () => {
    test('should set options', () => {
      const getHeaderClass: any = component.defaultColDef
        .headerClass as unknown;
      expect(component.defaultColDef.sortable).toBeTruthy();
      expect(getHeaderClass()).toEqual('bg-lightBg');
    });
  });

  describe('columnDefs', () => {
    test('should set col defs and correct formatters', () => {
      const formatter: any = component.columnDefs[0].valueFormatter as unknown;

      expect(component.columnDefs.length).toEqual(2);
      expect(formatter({ value: '123321' })).toEqual('1/1/1970');
      expect(formatter({ value: undefined })).toEqual('');
    });
  });
});
